import { useEffect } from 'react'

export function useDevelopmentTools() {
  useEffect(() => {
    if (!import.meta.env.DEV) {
      return
    }

    console.log('%c🧠 MindMirror Development Mode', 'font-size: 16px; font-weight: bold; color: #6366f1;')
    console.log('%cPress F12 to open DevTools', 'font-size: 12px; color: #64748b;')
    console.log('%cPress Ctrl+Shift+P to open Command Palette', 'font-size: 12px; color: #64748b;')
    
    // 检查性能指标
    if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITOR) {
      performance.mark('app-init')
    }
  }, [])
}
