export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  totalQuestions: number;
  icon?: string;
  difficulty?: string;
  estimatedTime?: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  trait?: string;    // 所属特质
  reverse?: boolean; // 是否反向计分
}

export interface TraitResult {
  name: string;
  score: number;
  description: string;
}

export interface AssessmentResult {
  id: string;
  totalScore: number;
  traits: TraitResult[];
  completedAt: Date;
  assessmentId: string;
  assessmentTitle: string;
}
