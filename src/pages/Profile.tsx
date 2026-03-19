import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, History, AlertCircle } from 'lucide-react';
import { Card } from '@/components/atoms';
import { useSettingsStore } from '@/store/settingsStore';

interface StoredResultData {
  assessmentId: string;
  answers: Record<string, number>;
  completedAt: string;
}

interface HistoryItem {
  id: string;
  assessmentId: string;
  assessmentName: string;
  completedAt: string;
  resultProfileName: string | null;
  totalScore: number | null;
}

const Profile: React.FC = () => {
  const { animationLevel, reducedMotion, fontSize, setFontSize } = useSettingsStore();
  const { animationLevel: animLevel, setAnimationLevel } = useSettingsStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const results: HistoryItem[] = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('quiz_result_')) {
            const dataStr = localStorage.getItem(key);
            if (dataStr) {
              const data: StoredResultData = JSON.parse(dataStr);
              results.push({
                id: key,
                assessmentId: data.assessmentId,
                assessmentName: getAssessmentName(data.assessmentId),
                completedAt: data.completedAt,
                resultProfileName: data.assessmentId === 'mbti-basic' ? '已完成' : null,
                totalScore: data.assessmentId === 'mbti-basic' ? Object.keys(data.answers).length * 5 : null,
              });
            }
          }
        }

        results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        setHistory(results);
      } catch (error) {
        console.error('Failed to load history:', error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getAssessmentName = (assessmentId: string): string => {
    const names: Record<string, string> = {
      'mbti-basic': 'MBTI 职业性格测试',
      'stress-check': '压力指数评估',
      'resilience-basic': '心理韧性评估',
      'logic-lite': '逻辑思维评估',
      'focus-style': '注意力与思维风格',
      'values-spectrum': '价值观光谱',
      'holland-basic': '霍兰德职业兴趣测试',
      'work-style-basic': '工作方式偏好',
    };
    return names[assessmentId] || assessmentId;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reducedMotion || animationLevel === 'none' ? 0 : 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          个人中心
        </h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                  <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    探索者
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    开始你的测评之旅
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  测评历史
                </h3>
              </div>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 p-4"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {result.assessmentName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(result.completedAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        {result.resultProfileName && (
                          <span className="text-sm font-medium text-primary-500">
                            {result.resultProfileName}
                          </span>
                        )}
                        {result.totalScore && (
                          <span className="ml-2 text-2xl font-bold text-primary-500">
                            {result.totalScore}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    暂无测评记录
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    完成测评后，您的时间记录会显示在这里
                  </p>
                </div>
              )}

              {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">已完成测评</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {history.length} 次
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  设置
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    动画级别
                  </label>
                  <div className="flex gap-2">
                    {(['none', 'low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setAnimationLevel(level)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          animLevel === level
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {level === 'none' ? '关闭' : level === 'low' ? '低' : level === 'medium' ? '中' : '高'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    字体大小: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;