import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Target, Heart, Users, Lightbulb, TestTube, ChevronRight, Clock, BookOpen } from 'lucide-react'

const ASSESSMENT_CATEGORIES = [
  {
    id: 'personality',
    title: '人格测评',
    icon: Brain,
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    assessments: [
      { id: 'sbti-personality', name: 'SBTI人格测试', description: '有趣又准的人格测评', questions: 24, duration: 5 },
      { id: 'ocean-bigfive', name: '大五人格', description: '科学的人格模型', questions: 28, duration: 6 },
    ]
  },
  {
    id: 'cognitive',
    title: '认知能力',
    icon: Target,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    assessments: [
      { id: 'iq-ravens', name: '瑞文智商测试', description: '测测你的智商水平', questions: 28, duration: 8 },
    ]
  },
  {
    id: 'emotional',
    title: '情绪情商',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
    assessments: [
      { id: 'eq-goleman', name: '情商测评', description: '了解你的情商高低', questions: 28, duration: 6 },
    ]
  },
  {
    id: 'career',
    title: '职业发展',
    icon: Lightbulb,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    assessments: [
      { id: 'holland-sds', name: '职业兴趣测评', description: '找到你的职业方向', questions: 28, duration: 6 },
    ]
  },
  {
    id: 'relationship',
    title: '人际关系',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    assessments: [
      { id: 'ecr-attachment', name: '依恋类型', description: '探索你的依恋风格', questions: 28, duration: 6 },
    ]
  },
]

export default function AssessmentsPage() {
  const navigate = useNavigate()

  const handleStartAssessment = (id: string) => {
    navigate(`/legacy/mode-select/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3">
          <TestTube size={14} className="text-violet-400" />
          <span className="text-sm text-violet-300">专业测评</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          心理测评中心
        </h1>
        <p className="text-white/50 text-sm">
          通过科学测评，深入了解真实的自己
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ASSESSMENT_CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              className={`rounded-2xl p-5 ${category.bgColor} border ${category.borderColor}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                  <p className="text-xs text-white/50">{category.assessments.length} 个测评</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.assessments.map((assessment) => (
                  <button
                    key={assessment.id}
                    onClick={() => handleStartAssessment(assessment.id)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-violet-300 transition-colors mb-1">
                          {assessment.name}
                        </h4>
                        <p className="text-xs text-white/40 mb-2">
                          {assessment.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} />
                            {assessment.questions}题
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {assessment.duration}分钟
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
                        <ChevronRight size={16} className="text-white/50 group-hover:text-white" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4">
        <div className="rounded-xl p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white mb-0.5">更多测评即将上线</h4>
              <p className="text-xs text-white/40">我们正在开发更多专业的心理测评，敬请期待</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}