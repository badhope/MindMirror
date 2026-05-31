import { useState } from 'react';
import { useAppStore } from '../store';

/**
 * 设置页面
 */
export const Settings = () => {
  const { clearHistory, assessmentHistory } = useAppStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = () => {
    if (assessmentHistory.length === 0) {
      alert('没有可清除的历史记录');
      return;
    }

    if (window.confirm(`确定要清除所有 ${assessmentHistory.length} 条历史记录吗？\n此操作不可恢复。`)) {
      setIsClearing(true);
      setTimeout(() => {
        clearHistory();
        setIsClearing(false);
        alert('历史记录已清除');
      }, 300);
    }
  };

  const handleResetApp = () => {
    if (window.confirm('确定要重置应用吗？\n这将清除所有本地数据。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center py-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">设置</h1>
        <p className="text-lg text-slate-600">自定义你的使用体验</p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* 外观设置 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎨</span> 外观
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">深色模式</p>
                <p className="text-sm text-slate-500">切换深色或浅色主题</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  darkMode ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    darkMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔔</span> 通知
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">推送通知</p>
                <p className="text-sm text-slate-500">接收测评提醒和更新</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 数据管理 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> 数据管理
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleClearHistory}
              disabled={isClearing || assessmentHistory.length === 0}
              className="w-full text-left p-4 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">清除历史记录</p>
                  <p className="text-sm text-slate-500">删除所有测评历史</p>
                </div>
                <span className="text-slate-400">
                  {isClearing ? '清除中...' : `${assessmentHistory.length} 条记录`}
                </span>
              </div>
            </button>
            
            <button
              onClick={handleResetApp}
              className="w-full text-left p-4 bg-red-50 rounded-xl text-red-700 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">重置应用</p>
                  <p className="text-sm text-red-500">清除所有数据，恢复默认设置</p>
                </div>
                <span className="text-red-400">⚠️</span>
              </div>
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span> 关于
          </h2>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span>版本</span>
              <span className="text-slate-400">1.0.0</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p>心测助手 - 专业心理测评平台</p>
              <p className="mt-2 text-slate-500">让每一次探索都有意义</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
