import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Assessment } from '../types';
import { mockAssessments } from '../data/mockData';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

const categories = ['全部', '性格', '健康', '情绪', '社交', '职业', '生活'];

export const Assessments = () => {
  const { setAssessments, assessments } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  
  useEffect(() => {
    if (assessments.length === 0) {
      setAssessments(mockAssessments);
    }
  }, [assessments.length, setAssessments]);

  // 根据分类筛选
  const filteredAssessments = useMemo(() => {
    if (selectedCategory === '全部') {
      return assessments;
    }
    return assessments.filter(a => a.category === selectedCategory);
  }, [assessments, selectedCategory]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 页面标题 */}
      <div className="text-center py-6 sm:py-8">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-2 sm:mb-4">
          心理测评中心
        </h1>
        <p className="text-base sm:text-xl text-slate-600">
          选择一个测评，开始了解自己
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium transition-all text-sm",
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 测评数量显示 */}
      <div className="text-center">
        <p className="text-slate-500">
          共找到 <span className="font-semibold text-blue-600">{filteredAssessments.length}</span> 个测评
        </p>
      </div>

      {/* 测评列表 */}
      {filteredAssessments.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">暂无测评</h3>
          <p className="text-slate-500">该分类下暂时没有测评</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAssessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      )}
    </div>
  );
};

interface AssessmentCardProps {
  assessment: Assessment;
}

function AssessmentCard({ assessment }: AssessmentCardProps) {
  return (
    <Link
      to={`/assessments/${assessment.id}`}
      className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all"
    >
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl text-xs sm:text-sm font-semibold">
            {assessment.category}
          </span>
          {assessment.difficulty && (
            <span className="px-2.5 sm:px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
              {assessment.difficulty}
            </span>
          )}
        </div>
        <span className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform">
          {assessment.icon}
        </span>
      </div>
      <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
        {assessment.title}
      </h3>
      <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 line-clamp-2">
        {assessment.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
          <span>📝</span>
          {assessment.totalQuestions} 题
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600 font-semibold group-hover:gap-2.5 transition-all text-sm">
          开始测评
          <span>→</span>
        </div>
      </div>
    </Link>
  );
}
