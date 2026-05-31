import { create } from 'zustand';
import { Assessment, Question, AssessmentResult } from '../types';
import type { User, AuthCredentials, RegisterData } from '../types/auth';
import { storage } from '../lib/utils';
import { 
  calculateBigFiveScores, 
  calculateOverallScore 
} from '../services/bigFiveScoring';
import { calculateStressTestTraits } from '../services/stressTestScoring';
import { calculateGAD7Traits } from '../services/anxietyGad7Scoring';
import { authService } from '../services/auth';
import type { Locale } from '../i18n';

const STORAGE_KEY_HISTORY = 'assessmentHistory';
const STORAGE_KEY_LOCALE = 'locale';

interface AppState {
  // 用户认证相关
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: string | null;

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
  
  // 语言和主题
  locale: Locale;
  
  // 历史记录
  assessmentHistory: AssessmentResult[];
  
  // Actions - 用户认证
  initializeAuth: () => void;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearAuthError: () => void;

  // Actions - 测评相关
  setAssessments: (assessments: Assessment[]) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, score: number) => void;
  setCurrentStep: (step: 'intro' | 'quiz' | 'result') => void;
  setResult: (result: AssessmentResult | null) => void;
  resetAssessment: () => void;
  calculateResult: (assessmentId: string, assessmentTitle: string) => void;
  
  // 语言设置
  setLocale: (locale: Locale) => void;
  
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
  // 初始化时从localStorage加载数据
  const initialHistory = storage.get<AssessmentResult[]>(STORAGE_KEY_HISTORY, []);
  const initialLocale = storage.get<Locale>(STORAGE_KEY_LOCALE, 'en');
  const initialUser = authService.getCurrentUser();
  
  return {
    // 初始状态 - 用户认证
    user: initialUser,
    isAuthenticated: !!initialUser,
    authLoading: false,
    authError: null,

    // 初始状态 - 测评
    assessments: [],
    currentAssessment: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    result: null,
    isLoading: false,
    currentStep: 'intro',
    isSidebarOpen: false,
    locale: initialLocale,
    assessmentHistory: initialHistory,
    
    // Actions - 用户认证
    initializeAuth: () => {
      const user = authService.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: !!user,
        authError: null 
      });
    },

    login: async (credentials: AuthCredentials) => {
      set({ authLoading: true, authError: null });
      
      try {
        const response = await authService.login(credentials);
        
        if (response.success && response.user) {
          set({ 
            user: response.user, 
            isAuthenticated: true,
            authLoading: false,
            authError: null 
          });
          return true;
        } else {
          set({ 
            authLoading: false,
            authError: response.error || 'Login failed'
          });
          return false;
        }
      } catch (error) {
        set({ 
          authLoading: false,
          authError: 'An unexpected error occurred'
        });
        return false;
      }
    },

    register: async (data: RegisterData) => {
      set({ authLoading: true, authError: null });
      
      try {
        const response = await authService.register(data);
        
        if (response.success && response.user) {
          set({ 
            user: response.user, 
            isAuthenticated: true,
            authLoading: false,
            authError: null 
          });
          return true;
        } else {
          set({ 
            authLoading: false,
            authError: response.error || 'Registration failed'
          });
          return false;
        }
      } catch (error) {
        set({ 
          authLoading: false,
          authError: 'An unexpected error occurred'
        });
        return false;
      }
    },

    logout: () => {
      authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false,
        authError: null 
      });
    },

    clearAuthError: () => {
      set({ authError: null });
    },

    // Actions - 测评相关
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
    
    setLocale: (locale) => {
      storage.set(STORAGE_KEY_LOCALE, locale);
      set({ locale });
    },
    
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
      } else if (assessmentId === 'anxiety-gad7' || assessmentId === '3') {
        // GAD-7焦虑测试评分
        traits = calculateGAD7Traits(answers, questions);
        // 焦虑测试的总分就是GAD-7得分
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
