import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { AssessmentResult } from '../types';
import { mockAssessments, getQuestionsForAssessment } from '../data/mockData';

/**
 * 格式化日期时间
 */
function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  // 如果是今天
  if (diff < 24 * 60 * 60 * 1000 && d.getDate() === now.getDate()) {
    return `今天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 如果是昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth()) {
    return `昨天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // 其他情况显示完整日期
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 历史记录卡片组件
 */
function HistoryCard({ result, onDelete }: { result: AssessmentResult; onDelete: (id: string) => void }) {
  const { 
    setCurrentAssessment, 
    setQuestions, 
    setCurrentQuestionIndex, 
    setCurrentStep, 
    setResult 
  } = useAppStore();

  const handleViewAgain = () => {
    const assessment = mockAssessments.find((a: { id: string; }) => a.id === result.assessmentId);
    if (assessment) {
      setCurrentAssessment(assessment);
      const questions = getQuestionsForAssessment(assessment.id);
      setQuestions(questions);
      setCurrentQuestionIndex(0);
      setResult(result);
      setCurrentStep('result');
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这条记录吗？')) {
      onDelete(result.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{result.assessmentTitle}</h3>
          <p className="text-sm sm:text-base text-slate-500 mt-1">{formatDateTime(result.completedAt)}</p>
        </div>
        <button
          onClick={handleDelete}
          className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
        >
          🗑️
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-blue-600">{result.totalScore}</div>
            <div className="text-sm sm:text-base text-slate-600 mt-1">综合得分</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {result.traits.slice(0, 3).map((trait, idx) => (
          <span 
            key={idx} 
            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
          >
            {trait.name} {trait.score}分
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          to={`/assessments/${result.assessmentId}`}
          onClick={handleViewAgain}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all text-center shadow-md"
        >
          查看详情
        </Link>
      </div>
    </div>
  );
}

/**
 * 空状态组件
 */
function EmptyState() {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-12 sm:p-16 shadow-lg border border-slate-100 text-center">
      <div className="text-6xl sm:text-7xl mb-4 sm:mb-6">📚</div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 sm:mb-4">暂无测评记录</h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto text-base sm:text-lg">
        完成测评后，你的历史记录将会在这里显示，方便你查看和对比
      </p>
      <Link
        to="/assessments"
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
      >
        开始第一次测评
        <span>→</span>
      </Link>
    </div>
  );
}

export const History = () => {
  const { assessmentHistory, loadHistory, deleteHistoryItem, clearHistory } = useAppStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClearAll = () => {
    if (window.confirm('确定要清除所有历史记录吗？此操作不可恢复。')) {
      clearHistory();
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">历史记录</h1>
          <p className="text-lg text-slate-600 mt-2">
            共 {assessmentHistory.length} 条记录
          </p>
        </div>
        {assessmentHistory.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            清除全部
          </button>
        )}
      </div>

      {assessmentHistory.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6">
          {assessmentHistory.map((result) => (
            <HistoryCard 
              key={result.id} 
              result={result} 
              onDelete={deleteHistoryItem} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
