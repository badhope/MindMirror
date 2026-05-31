import { create } from 'zustand';
import { Assessment, Question, AssessmentResult } from '../types';
import { storage } from '../lib/utils';
import { 
  calculateBigFiveScores, 
  calculateOverallScore 
} from '../services/bigFiveScoring';
import { calculateStressTestTraits } from '../services/stressTestScoring';

const STORAGE_KEY_HISTORY = 'assessmentHistory';

interface AppState {
  // 测评相关
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  
  // 结果相关
  result: AssessmentResult | null;
  
  // UI状态
  isLoading: boolean;
  currentStep: 'intro' | 'quiz' | 'result';
  isSidebarOpen: boolean;
  
  // 历史记录
  assessmentHistory: AssessmentResult[];
  
  // Actions
  setAssessments: (assessments: Assessment[]) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, score: number) => void;
  setCurrentStep: (step: 'intro' | 'quiz' | 'result') => void;
  setResult: (result: AssessmentResult | null) => void;
  resetAssessment: () => void;
  calculateResult: (assessmentId: string, assessmentTitle: string) => void;
  
  // 历史记录相关
  loadHistory: () => void;
  addToHistory: (result: AssessmentResult) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  
  // 侧边栏
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  // 初始化时从localStorage加载历史记录
  const initialHistory = storage.get<AssessmentResult[]>(STORAGE_KEY_HISTORY, []);
  
  return {
    // 初始状态
    assessments: [],
    currentAssessment: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    result: null,
    isLoading: false,
    currentStep: 'intro',
    isSidebarOpen: false,
    assessmentHistory: initialHistory,
    
    // Actions
    setAssessments: (assessments) => set({ assessments }),
    
    setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
    
    setQuestions: (questions) => set({ questions }),
    
    setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
    
    setAnswer: (questionId, score) => 
      set((state) => ({ 
        answers: { ...state.answers, [questionId]: score } 
      })),
    
    setCurrentStep: (step) => set({ currentStep: step }),
    
    setResult: (result) => set({ result }),
    
    resetAssessment: () => 
      set({ 
        currentQuestionIndex: 0, 
        answers: {}, 
        result: null, 
        currentStep: 'intro' 
      }),
    
    calculateResult: (assessmentId, assessmentTitle) => {
      const { answers, questions } = get();
      
      let traits;
      let totalScore;
      
      // 根据测评类型使用不同的评分算法
      if (assessmentId === 'stress-test' || assessmentId === '2') {
        // 压力测试评分
        traits = calculateStressTestTraits(answers, questions);
        // 压力测试的总分就是压力水平得分
        totalScore = traits[0]?.score || 0;
      } else {
        // 大五人格评分（默认）
        traits = calculateBigFiveScores(answers, questions);
        totalScore = calculateOverallScore(traits);
      }
      
      const result: AssessmentResult = {
        id: Date.now().toString(),
        totalScore,
        traits,
        completedAt: new Date(),
        assessmentId,
        assessmentTitle
      };
      
      set({ result, currentStep: 'result' });
      
      // 自动添加到历史记录
      get().addToHistory(result);
    },
    
    // 历史记录相关
    loadHistory: () => {
      const history = storage.get<AssessmentResult[]>(STORAGE_KEY_HISTORY, []);
      set({ assessmentHistory: history });
    },
    
    addToHistory: (result) => 
      set((state) => {
        const newHistory = [result, ...state.assessmentHistory];
        storage.set(STORAGE_KEY_HISTORY, newHistory);
        return { assessmentHistory: newHistory };
      }),
    
    clearHistory: () => 
      set(() => {
        storage.set(STORAGE_KEY_HISTORY, []);
        return { assessmentHistory: [] };
      }),
    
    deleteHistoryItem: (id) => 
      set((state) => {
        const newHistory = state.assessmentHistory.filter(item => item.id !== id);
        storage.set(STORAGE_KEY_HISTORY, newHistory);
        return { assessmentHistory: newHistory };
      }),
    
    // 侧边栏
    toggleSidebar: () => 
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    
    setSidebarOpen: (open) => 
      set({ isSidebarOpen: open })
  };
});
