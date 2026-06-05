export interface TraitScore {
  name: string;
  score: number;
  description: string;
  percentile?: number;
  tScore?: number;
  rawScore?: number;
  maxScore?: number;
  level?: 'low' | 'medium' | 'high';
}

export interface DetailedReport {
  summary: {
    title: string;
    score: number;
    description: string;
    color: string;
  };
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  detailedAnalysis?: Record<string, any>;
  [key: string]: any;
}

export interface AssessmentMetadata {
  duration: number;
  completed: boolean;
  version: string;
  device?: string;
  browser?: string;
}

export interface UnifiedAssessmentResult {
  id: string;
  assessmentId: string;
  assessmentType: AssessmentType;
  title: string;
  timestamp: number;
  totalScore: number;
  traits: TraitScore[];
  rawAnswers: Record<string, number>;
  processedScores: Record<string, number>;
  report: DetailedReport;
  tags: string[];
  metadata: AssessmentMetadata;
  userId?: string;
}

export type AssessmentType =
  | 'personality' // 人格类
  | 'stress' // 压力类
  | 'anxiety' // 焦虑类
  | 'depression' // 抑郁类
  | 'emotional' // 情绪类
  | 'cognitive' // 认知类
  | 'social' // 社交类
  | 'burnout' // 职业倦怠
  | 'life' // 生活满意度
  | 'resilience' // 心理韧性
  | 'other'; // 其他

export interface PersonalDataCenter {
  userId: string;
  results: UnifiedAssessmentResult[];
  tags: UserTag[];
  summaries: PeriodicSummary[];
  lastUpdated: number;
  statistics: DataStatistics;
}

export interface UserTag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  criteria?: TagCriteria;
  manual: boolean;
  createdAt: number;
  resultCount: number;
}

export interface TagCriteria {
  type: 'automatic' | 'manual';
  conditions: TagCondition[];
  operator: 'and' | 'or';
}

export interface TagCondition {
  assessmentType?: AssessmentType;
  trait?: string;
  operator: 'gt' | 'lt' | 'eq' | 'between' | 'contains';
  value: number | string | [number, number];
}

export interface PeriodicSummary {
  id: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: number;
  endDate: number;
  assessments: string[];
  trends: TrendAnalysis;
  insights: string[];
  recommendations: string[];
  overallScore?: number;
  createdAt: number;
}

export interface TrendAnalysis {
  traits: Record<
    string,
    {
      direction: 'up' | 'down' | 'stable';
      change: number;
      changePercent: number;
    }
  >;
  overall: {
    direction: 'up' | 'down' | 'stable';
    change: number;
  };
}

export interface DataStatistics {
  totalAssessments: number;
  totalTime: number;
  averageScore: number;
  assessmentTypes: Record<AssessmentType, number>;
  traitAverages: Record<string, number>;
  tagDistribution: Record<string, number>;
  streakDays: number;
  lastAssessmentDate?: number;
}

export interface DataAggregation {
  assessmentId: string;
  aggregationType: 'sum' | 'average' | 'weighted_average' | 'percentile';
  values: {
    trait: string;
    value: number;
    weight: number;
  }[];
  finalValue: number;
}

export interface DataValidation {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata: {
    checkedAt: number;
    checkedFields: string[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface DataMigration {
  fromVersion: string;
  toVersion: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  records: MigrationRecord[];
  errors: MigrationError[];
  startedAt?: number;
  completedAt?: number;
}

export interface MigrationRecord {
  recordId: string;
  status: 'pending' | 'success' | 'failed';
  originalData?: any;
  migratedData?: any;
  error?: string;
}

export interface MigrationError {
  recordId: string;
  error: string;
  stack?: string;
  recoverable: boolean;
}

export interface DataSyncOptions {
  autoSync: boolean;
  syncInterval: number;
  conflictResolution: 'local' | 'remote' | 'newest' | 'manual';
  backupBeforeSync: boolean;
}

export interface DataSyncStatus {
  lastSync: number;
  status: 'idle' | 'syncing' | 'error' | 'success';
  progress: number;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  recordId: string;
  localData: any;
  remoteData: any;
  resolution?: 'local' | 'remote' | 'newest';
}

export interface AssessmentTrend {
  assessmentId: string;
  traitName: string;
  dataPoints: TrendDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  change: number;
  changePercent: number;
}

export interface TrendDataPoint {
  timestamp: number;
  score: number;
  resultId: string;
}

export interface AssessmentComparison {
  resultIds: string[];
  traits: ComparisonTrait[];
  overallScore: number;
  insights: string[];
}

export interface ComparisonTrait {
  name: string;
  scores: number[];
  average: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}
