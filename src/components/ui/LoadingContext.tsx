import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'
import { LoadingProgress, ProgressBar } from './LoadingProgress'

interface LoadingContextType {
  isLoading: boolean
  progress: number
  message: string
  showProgress: boolean
  startLoading: (message?: string, showProgress?: boolean) => void
  updateProgress: (progress: number) => void
  updateMessage: (message: string) => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [showProgress, setShowProgress] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = useCallback((msg = '加载中...', showProg = false) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsLoading(true)
    setMessage(msg)
    setShowProgress(showProg)
    setProgress(0)
  }, [])

  const updateProgress = useCallback((prog: number) => {
    setProgress(Math.min(Math.max(prog, 0), 100))
  }, [])

  const updateMessage = useCallback((msg: string) => {
    setMessage(msg)
  }, [])

  const stopLoading = useCallback(() => {
    setProgress(100)
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }, [])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        message,
        showProgress,
        startLoading,
        updateProgress,
        updateMessage,
        stopLoading,
      }}
    >
      {children}
      <LoadingProgress
        isLoading={isLoading}
        message={message}
        progress={progress}
        showProgress={showProgress}
      />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

interface RouteTransitionProps {
  isTransitioning: boolean
  children: ReactNode
}

export function RouteTransition({ isTransitioning, children }: RouteTransitionProps) {
  return (
    <>
      {children}
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
          <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse" />
        </div>
      )}
    </>
  )
}

export { LoadingProgress, ProgressBar }
