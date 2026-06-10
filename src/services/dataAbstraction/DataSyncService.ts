import { storage } from '../../lib/utils';
import { UnifiedAssessmentResult, DataSyncStatus, SyncConflict } from '../../types/dataAbstraction';
import { AssessmentResult } from '../../types';

const PERSONAL_CENTER_KEY = 'personalDataCenter';

/**
 * Canonical mapper from the on-disk `AssessmentResult` (the shape
 * stored in `assessmentHistory` by the zustand store) to the
 * `UnifiedAssessmentResult` shape the dashboard / aggregation layer
 * consumes.  This used to live as a private method on
 * DataSyncService; pulling it out lets the store-derived dashboard
 * path skip the `personalDataCenter` cache entirely.
 */
export function toUnifiedResult(
  result: AssessmentResult | (Partial<UnifiedAssessmentResult> & { id: string })
): UnifiedAssessmentResult | null {
  if (!result || !(result as { id?: unknown }).id) return null;

  const anyResult = result as AssessmentResult & {
    timestamp?: number;
    completedAt?: Date | string;
    title?: string;
    assessmentType?: UnifiedAssessmentResult['assessmentType'];
    rawAnswers?: Record<string, number>;
    processedScores?: Record<string, number>;
    report?: UnifiedAssessmentResult['report'];
    tags?: string[];
    metadata?: Partial<UnifiedAssessmentResult['metadata']>;
    duration?: number;
    completed?: boolean;
    version?: string;
  };

  const completedAt = anyResult.completedAt;
  const timestamp =
    typeof anyResult.timestamp === 'number'
      ? anyResult.timestamp
      : completedAt
        ? new Date(completedAt).getTime()
        : Date.now();

  const assessmentId = anyResult.assessmentId || 'unknown';
  const assessmentType: UnifiedAssessmentResult['assessmentType'] =
    anyResult.assessmentType ?? detectAssessmentType(assessmentId);

  const title = anyResult.assessmentTitle || anyResult.title || '心理测评';

  return {
    id: anyResult.id,
    assessmentId,
    assessmentType,
    title,
    timestamp,
    totalScore: anyResult.totalScore || 0,
    traits: normalizeTraits(anyResult.traits || []),
    rawAnswers: anyResult.rawAnswers || {},
    processedScores: anyResult.processedScores || {},
    report: anyResult.report || {
      summary: { title, score: anyResult.totalScore || 0, description: '', color: '#6366f1' },
    },
    tags: anyResult.tags || [],
    metadata: {
      duration: anyResult.metadata?.duration ?? anyResult.duration ?? 0,
      completed: anyResult.metadata?.completed ?? anyResult.completed ?? true,
      version: anyResult.metadata?.version ?? anyResult.version ?? '1.0.0',
    },
  };
}

export function detectAssessmentType(
  assessmentId: string
): UnifiedAssessmentResult['assessmentType'] {
  const typeMap: Record<string, UnifiedAssessmentResult['assessmentType']> = {
    'big-five': 'personality',
    bigfive: 'personality',
    'stress-test': 'stress',
    'anxiety-gad7': 'anxiety',
    'social-support': 'social',
    'mbi-burnout': 'burnout',
    'life-satisfaction': 'life',
    'resilience-cdrisc': 'resilience',
  };
  return typeMap[assessmentId] || 'other';
}

function normalizeTraits(traits: any[]): UnifiedAssessmentResult['traits'] {
  return traits.map(trait => ({
    name: trait.name || trait.traitName || 'Unknown',
    score: trait.score || 0,
    description: trait.description || '',
    percentile: trait.percentile,
    tScore: trait.tScore,
    rawScore: trait.rawScore,
    maxScore: trait.maxScore,
    level: calculateTraitLevel(trait.score, trait.maxScore),
  }));
}

function calculateTraitLevel(score: number, maxScore?: number): 'low' | 'medium' | 'high' {
  if (!maxScore) return 'medium';
  const percentage = score / maxScore;
  if (percentage < 0.33) return 'low';
  if (percentage > 0.66) return 'high';
  return 'medium';
}

class DataSyncService {
  private syncStatus: DataSyncStatus = {
    lastSync: 0,
    status: 'idle',
    progress: 0,
    conflicts: [],
  };

  /**
   * One-shot migration from the on-disk `assessmentHistory` (new
   * canonical store) into the derived `personalDataCenter` cache
   * (legacy consumers).  Kept for back-compat with code paths that
   * still read from the personalCenter; new code should call
   * `toUnifiedResult` directly against the store.
   */
  async syncAllAssessments(): Promise<void> {
    try {
      this.syncStatus.status = 'syncing';
      this.syncStatus.progress = 0;

      const assessments = this.loadAllAssessmentsFromHistory();
      const personalCenter = this.getPersonalDataCenter();

      const existingIds = new Set(personalCenter.results.map(r => r.id));
      const newResults = assessments
        .filter(a => !existingIds.has(a.id))
        .map(a => this.normalizeResult(a));

      this.syncStatus.progress = 50;

      for (const result of newResults) {
        personalCenter.results.push(result);
      }

      personalCenter.results.sort((a, b) => b.timestamp - a.timestamp);
      personalCenter.lastUpdated = Date.now();

      this.syncStatus.progress = 90;

      this.savePersonalDataCenter(personalCenter);

      this.syncStatus.progress = 100;
      this.syncStatus.status = 'success';
      this.syncStatus.lastSync = Date.now();
    } catch (error) {
      this.syncStatus.status = 'error';
      console.error('Data sync failed:', error);
      throw error;
    }
  }

  private loadAllAssessmentsFromHistory(): UnifiedAssessmentResult[] {
    try {
      const historyData = storage.get<any>('assessmentHistory', null);
      if (!historyData) return [];

      const history = Array.isArray(historyData) ? historyData : [historyData];

      return history
        .map(item => toUnifiedResult(item as AssessmentResult))
        .filter((r): r is UnifiedAssessmentResult => r !== null);
    } catch (error) {
      console.error('Failed to load assessments from history:', error);
      return [];
    }
  }

  private normalizeResult(result: UnifiedAssessmentResult): UnifiedAssessmentResult {
    return {
      ...result,
      traits: normalizeTraits(result.traits),
      metadata: {
        ...result.metadata,
        version: '1.0.0',
      },
    };
  }

  getPersonalDataCenter(): any {
    try {
      const data = storage.get<any>(PERSONAL_CENTER_KEY, null);
      if (data) return data;

      return {
        userId: 'default',
        results: [],
        tags: [],
        summaries: [],
        lastUpdated: Date.now(),
        statistics: {
          totalAssessments: 0,
          totalTime: 0,
          averageScore: 0,
          assessmentTypes: {},
          traitAverages: {},
          tagDistribution: {},
          streakDays: 0,
        },
      };
    } catch (error) {
      console.error('Failed to get personal data center:', error);
      return null;
    }
  }

  private savePersonalDataCenter(data: any): void {
    storage.set(PERSONAL_CENTER_KEY, data);
  }

  getSyncStatus(): DataSyncStatus {
    return { ...this.syncStatus };
  }

  async resolveConflict(conflict: SyncConflict, resolution: 'local' | 'remote'): Promise<void> {
    const personalCenter = this.getPersonalDataCenter();
    const index = personalCenter.results.findIndex(r => r.id === conflict.recordId);

    if (index !== -1) {
      personalCenter.results[index] =
        resolution === 'local' ? conflict.localData : conflict.remoteData;

      this.savePersonalDataCenter(personalCenter);
    }

    this.syncStatus.conflicts = this.syncStatus.conflicts.filter(
      c => c.recordId !== conflict.recordId
    );
  }

  getResultsByType(type: UnifiedAssessmentResult['assessmentType']): UnifiedAssessmentResult[] {
    const personalCenter = this.getPersonalDataCenter();
    return personalCenter.results.filter((r: UnifiedAssessmentResult) => r.assessmentType === type);
  }

  getResultsByDateRange(startDate: number, endDate: number): UnifiedAssessmentResult[] {
    const personalCenter = this.getPersonalDataCenter();
    return personalCenter.results.filter(
      (r: UnifiedAssessmentResult) => r.timestamp >= startDate && r.timestamp <= endDate
    );
  }

  searchResults(query: string): UnifiedAssessmentResult[] {
    const personalCenter = this.getPersonalDataCenter();
    const lowerQuery = query.toLowerCase();

    return personalCenter.results.filter(
      (r: UnifiedAssessmentResult) =>
        r.title.toLowerCase().includes(lowerQuery) ||
        r.assessmentId.toLowerCase().includes(lowerQuery) ||
        r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export const dataSyncService = new DataSyncService();
