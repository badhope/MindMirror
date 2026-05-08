import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface LoadingProgressProps {
  isLoading: boolean
  message?: string
  progress?: number
  showProgress?: boolean
}

export function LoadingProgress({
  isLoading,
  message = '加载中...',
  progress,
  showProgress = false
}: LoadingProgressProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) {
      setCurrentProgress(0)
      
      intervalRef.current = setInterval(() => {
        setCurrentProgress(prev => {
          const increment = Math.random() * 15 + 5
          const newProgress = Math.min(prev + increment, progress ?? 95)
          return newProgress
        })
      }, 200)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      setCurrentProgress(100)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLoading, progress])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
        >
          <div className="text-center max-w-md w-full px-8">
            <motion.div
              className="relative w-24 h-24 mx-auto mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold text-white mb-4"
            >
              {message}
            </motion.h2>

            {showProgress && (
              <div className="space-y-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-white/50">
                  {Math.round(currentProgress)}%
                </p>
              </div>
            )}

            <motion.div
              className="flex justify-center gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PageLoader({ message = '加载中...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 mx-auto mb-4 border-2 border-white/20 border-t-violet-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-white/70 text-sm">{message}</p>
      </div>
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ progress, showLabel = true, className = '' }: ProgressBarProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-white/50 text-right">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'image'
  count?: number
}

export function SkeletonLoader({ variant = 'text', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = (key: number) => {
    switch (variant) {
      case 'text':
        return (
          <div key={key} className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse" style={{ width: '100%' }} />
            <div className="h-4 bg-white/10 rounded animate-pulse" style={{ width: '80%' }} />
          </div>
        )
      case 'card':
        return (
          <div key={key} className="p-4 bg-white/5 rounded-xl animate-pulse">
            <div className="h-32 bg-white/10 rounded-lg mb-3" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        )
      case 'avatar':
        return (
          <div key={key} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-white/10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        )
      case 'image':
        return (
          <div key={key} className="animate-pulse">
            <div className="h-48 bg-white/10 rounded-xl mb-3" />
            <div className="h-4 bg-white/10 rounded w-1/2" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  )
}
