import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Assessment } from '../types';
import { mockAssessments } from '../data/mockData';
import { useAppStore } from '../store';

const features = [
  { icon: '📊', title: '科学分析', desc: '基于心理学理论，提供专业测评结果' },
  { icon: '🎯', title: '精准定位', desc: '深入分析个人特点，发现潜在优势' },
  { icon: '🚀', title: '成长指引', desc: '定制化建议，助力个人成长发展' }
];

export const Home = () => {
  const { setAssessments, assessments } = useAppStore();
  
  useEffect(() => {
    setAssessments(mockAssessments);
  }, [setAssessments]);

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Hero 区域 */}
      <section className="text-center py-10 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <span>✨</span>
            专业心理测评，科学自我探索
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 sm:mb-6 leading-tight">
          认识自己
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
            是一切改变的开始
          </span>
        </h1>
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          通过专业的心理测评，深入了解你的性格特点、情绪状态和行为模式，开启一段有意义的自我探索之旅。
        </p>
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/assessments"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-lg font-semibold rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            开始测评
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* 功能特点 */}
      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 热门测评 */}
      <section>
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">热门测评</h2>
            <p className="text-sm sm:text-base text-slate-600">选择适合你的测评开始探索</p>
          </div>
          <Link to="/assessments" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 sm:gap-2 text-sm">
            查看全部 <span>→</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assessments.slice(0, 3).map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      </section>

      {/* 关于测评 */}
      <section className="bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg border border-blue-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">关于心理测评</h2>
          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8">
            我们的心理测评基于科学的心理学理论设计，帮助你更好地了解自己。
            测评结果仅供参考，如有需要请咨询专业心理医生。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span>✓</span>
              科学理论
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span>✓</span>
              专业分析
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span>✓</span>
              隐私保护
            </div>
          </div>
        </div>
      </section>
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
        <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl text-xs sm:text-sm font-semibold">
          {assessment.category}
        </span>
        <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
          {assessment.icon}
        </span>
      </div>
      <h3 className="text-lg sm:text-2xl font-bold text-slate-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
        {assessment.title}
      </h3>
      <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 line-clamp-2">
        {assessment.description}
      </p>
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
        <span className="flex items-center gap-1.5 sm:gap-2">
          <span>📝</span>
          {assessment.totalQuestions} 题
        </span>
        <span className="group-hover:translate-x-0.5 transition-transform">
          开始 →
        </span>
      </div>
    </Link>
  );
}
