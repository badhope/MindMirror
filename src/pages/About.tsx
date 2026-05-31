export function About() {
  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          关于心测助手
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          专业的心理测评平台，帮助你更好地了解自己
        </p>
      </div>

      <div className="space-y-6">
        {/* 使命 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🎯</span> 我们的使命
          </h2>
          <p className="text-slate-600 leading-relaxed">
            心测助手致力于为用户提供专业、科学的心理测评服务，通过一系列精心设计的测评问卷，帮助用户更好地了解自己的性格特点、情绪状态和行为模式。
          </p>
        </div>

        {/* 特性 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>✨</span> 核心特性
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">科学分析</h3>
              <p className="text-sm text-slate-600">基于心理学理论的专业测评</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">精准定位</h3>
              <p className="text-sm text-slate-600">发现你的个人特点和优势</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">隐私保护</h3>
              <p className="text-sm text-slate-600">你的数据完全安全保密</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
              <h3 className="font-bold text-slate-800 mb-2">成长指引</h3>
              <p className="text-sm text-slate-600">提供个人化发展建议</p>
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📧</span> 联系我们
          </h2>
          <p className="text-slate-600">
            如有任何问题或建议，欢迎联系我们：
          </p>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl text-center">
            <p className="text-blue-600 font-medium">support@xinceshoushu.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
