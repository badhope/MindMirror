import './utils/logger'
import './utils/assessmentCache'
import { preloadTopAssessments } from './utils/dynamicAssessmentLoader'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// 路由配置
interface RouterConfig {
  mode: 'hash' | 'browser' | 'auto'
  customDomain?: string[]
  forceHash?: boolean
}

const routerConfig: RouterConfig = {
  mode: 'auto',
  customDomain: [
    'humanitysos.dpdns.org',
    'mindmirror.app'
  ],
  forceHash: false
}

// 配置化路由适配器
const createRouter = (config: RouterConfig) => {
  if (config.forceHash) {
    return HashRouter
  }

  if (config.mode === 'hash') {
    return HashRouter
  }

  if (config.mode === 'browser') {
    return BrowserRouter
  }

  // auto模式 - 智能检测
  const { hostname, port, pathname } = window.location
  
  // 检查自定义域名
  if (config.customDomain?.includes(hostname)) {
    return HashRouter
  }
  
  // 检查GitHub Pages类环境
  const isStaticHost = /github\.io|gitlab\.io|vercel\.app|netlify\.app|surge\.sh/.test(hostname)
  if (isStaticHost) {
    return HashRouter
  }
  
  // 检查是否为开发环境
  if (import.meta.env.DEV) {
    return BrowserRouter
  }
  
  // 检查是否有端口（本地部署）
  if (port && port !== '80' && port !== '443') {
    return BrowserRouter
  }
  
  // 其他情况默认使用HashRouter
  return HashRouter
}

const Router = createRouter(routerConfig)

setTimeout(() => {
  preloadTopAssessments()
  
  if (import.meta.env.DEV) {
    import('./utils/performanceBenchmark')
  }
}, 3000)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Router>
      <App />
    </Router>
  </ErrorBoundary>
)
