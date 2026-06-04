import { UserTag, TagCriteria, UnifiedAssessmentResult } from '../../types/dataAbstraction';
import { storage } from '../../lib/utils';
import { dataSyncService } from '../dataAbstraction/DataSyncService';

const TAGS_STORAGE_KEY = 'userTags';

const AUTO_TAGS: Array<{
  id: string;
  name: string;
  color: string;
  icon: string;
  criteria: TagCriteria;
}> = [
  {
    id: 'high_stability',
    name: '情绪稳定',
    color: 'bg-green-100 text-green-800',
    icon: '🧘',
    criteria: {
      type: 'automatic',
      conditions: [{ trait: '情绪稳定性', operator: 'gt', value: 70 }],
      operator: 'and',
    },
  },
  {
    id: 'improving',
    name: '持续进步',
    color: 'bg-blue-100 text-blue-800',
    icon: '📈',
    criteria: {
      type: 'automatic',
      conditions: [],
      operator: 'and',
    },
  },
  {
    id: 'stable',
    name: '状态稳定',
    color: 'bg-gray-100 text-gray-800',
    icon: '⚖️',
    criteria: {
      type: 'automatic',
      conditions: [],
      operator: 'and',
    },
  },
  {
    id: 'attention_needed',
    name: '需要关注',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⚠️',
    criteria: {
      type: 'automatic',
      conditions: [{ assessmentType: 'stress', operator: 'gt', value: 20 }],
      operator: 'or',
    },
  },
  {
    id: 'stressed',
    name: '压力较高',
    color: 'bg-orange-100 text-orange-800',
    icon: '😰',
    criteria: {
      type: 'automatic',
      conditions: [{ assessmentType: 'stress', operator: 'gt', value: 25 }],
      operator: 'and',
    },
  },
  {
    id: 'anxious',
    name: '焦虑倾向',
    color: 'bg-purple-100 text-purple-800',
    icon: '😟',
    criteria: {
      type: 'automatic',
      conditions: [{ assessmentType: 'anxiety', operator: 'gt', value: 10 }],
      operator: 'and',
    },
  },
  {
    id: 'balanced',
    name: '人格平衡',
    color: 'bg-teal-100 text-teal-800',
    icon: '⚖️',
    criteria: {
      type: 'automatic',
      conditions: [],
      operator: 'and',
    },
  },
  {
    id: 'creative',
    name: '高开放性',
    color: 'bg-pink-100 text-pink-800',
    icon: '🎨',
    criteria: {
      type: 'automatic',
      conditions: [{ trait: '开放性', operator: 'gt', value: 75 }],
      operator: 'and',
    },
  },
];

class TagService {
  private autoTags: UserTag[] = [];

  constructor() {
    this.initializeAutoTags();
  }

  private initializeAutoTags(): void {
    this.autoTags = AUTO_TAGS.map(autoTag => ({
      id: autoTag.id,
      name: autoTag.name,
      color: autoTag.color,
      icon: autoTag.icon,
      criteria: autoTag.criteria,
      manual: false,
      createdAt: Date.now(),
      resultCount: 0,
    }));
  }

  getAllTags(): UserTag[] {
    const userTags = this.getUserTags();
    return [...this.autoTags, ...userTags];
  }

  private getUserTags(): UserTag[] {
    try {
      return storage.get<UserTag[]>(TAGS_STORAGE_KEY, []);
    } catch {
      return [];
    }
  }

  private saveUserTags(tags: UserTag[]): void {
    storage.set(TAGS_STORAGE_KEY, tags);
  }

  createUserTag(name: string, color: string, icon?: string): UserTag {
    const userTag: UserTag = {
      id: `user_${Date.now()}`,
      name,
      color,
      icon,
      manual: true,
      createdAt: Date.now(),
      resultCount: 0,
    };

    const userTags = this.getUserTags();
    userTags.push(userTag);
    this.saveUserTags(userTags);

    return userTag;
  }

  deleteUserTag(tagId: string): boolean {
    const userTags = this.getUserTags();
    const filtered = userTags.filter(t => t.id !== tagId);

    if (filtered.length === userTags.length) {
      return false;
    }

    this.saveUserTags(filtered);
    return true;
  }

  updateUserTag(tagId: string, updates: Partial<UserTag>): boolean {
    const userTags = this.getUserTags();
    const index = userTags.findIndex(t => t.id === tagId);

    if (index === -1) {
      return false;
    }

    userTags[index] = { ...userTags[index], ...updates };
    this.saveUserTags(userTags);
    return true;
  }

  applyTagsToResults(): void {
    const personalCenter = dataSyncService.getPersonalDataCenter();
    const results = personalCenter.results;

    results.forEach(result => {
      const appliedTags = this.calculateTagsForResult(result);
      result.tags = appliedTags;
    });

    this.updateTagCounts(results);
  }

  private calculateTagsForResult(result: UnifiedAssessmentResult): string[] {
    const tags: string[] = [];

    this.autoTags.forEach(autoTag => {
      if (this.checkTagCriteria(result, autoTag.criteria)) {
        tags.push(autoTag.name);
      }
    });

    return [...new Set([...result.tags.filter(t => this.isManualTag(t)), ...tags])];
  }

  private checkTagCriteria(result: UnifiedAssessmentResult, criteria: TagCriteria): boolean {
    if (criteria.conditions.length === 0) {
      return false;
    }

    const results = criteria.conditions.map(condition => {
      if (condition.trait) {
        const trait = result.traits.find(t => t.name === condition.trait);
        return trait
          ? this.checkCondition(trait.score, condition.operator, condition.value)
          : false;
      }

      if (condition.assessmentType) {
        return this.checkCondition(
          result.assessmentType === condition.assessmentType ? result.totalScore : 0,
          condition.operator,
          condition.value
        );
      }

      return false;
    });

    if (criteria.operator === 'and') {
      return results.every(r => r);
    } else {
      return results.some(r => r);
    }
  }

  private checkCondition(
    value: number,
    operator: TagCriteria['conditions'][0]['operator'],
    target: number | string | [number, number]
  ): boolean {
    switch (operator) {
      case 'gt':
        return value > (target as number);
      case 'lt':
        return value < (target as number);
      case 'eq':
        return value === (target as number);
      case 'between': {
        const [min, max] = target as [number, number];
        return value >= min && value <= max;
      }
      default:
        return false;
    }
  }

  private isManualTag(tagName: string): boolean {
    const userTags = this.getUserTags();
    return userTags.some(t => t.name === tagName);
  }

  private updateTagCounts(results: UnifiedAssessmentResult[]): void {
    const tagCounts: Record<string, number> = {};

    results.forEach(result => {
      result.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    this.autoTags.forEach(tag => {
      tag.resultCount = tagCounts[tag.name] || 0;
    });

    const userTags = this.getUserTags();
    userTags.forEach(tag => {
      tag.resultCount = tagCounts[tag.name] || 0;
    });
    this.saveUserTags(userTags);
  }

  /**
   * Persist a pre-computed tag → result count map.  Used by the
   * store's history-mutation path which doesn't go through the
   * `personalDataCenter` cache (it operates directly on the
   * on-disk `AssessmentResult[]` history) but still wants the
   * TagCloud / Dashboard counts to stay accurate.
   */
  rewriteCounts(counts: Record<string, number>): void {
    this.autoTags.forEach(tag => {
      tag.resultCount = counts[tag.name] || 0;
    });
    const userTags = this.getUserTags();
    userTags.forEach(tag => {
      tag.resultCount = counts[tag.name] || 0;
    });
    this.saveUserTags(userTags);
  }

  getTopTags(limit: number): string[] {
    const allTags = this.getAllTags();

    const sortedTags = [...allTags].sort((a, b) => b.resultCount - a.resultCount).slice(0, limit);

    return sortedTags.map(t => t.name);
  }

  getTagsByType(type: 'automatic' | 'manual'): UserTag[] {
    const allTags = this.getAllTags();
    return allTags.filter(t => t.manual === (type === 'manual'));
  }

  searchTags(query: string): UserTag[] {
    const allTags = this.getAllTags();
    const lowerQuery = query.toLowerCase();

    return allTags.filter(t => t.name.toLowerCase().includes(lowerQuery));
  }
}

export const tagService = new TagService();
