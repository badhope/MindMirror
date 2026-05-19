import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../../store'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Progress } from '../../../components/ui/Progress'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, Volume2, VolumeX, Check } from 'lucide-react'

interface Exercise {
  id: string
  title: string
  description: string
  duration?: number
  audioUrl?: string
}

interface TrainingProgram {
  id: string
  title: string
  description: string
  exercises: Exercise[]
  totalDuration: number
}

interface TrainingContextType {
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  phase: 'intro' | 'training' | 'complete'
  togglePlay: () => void
  complete: () => void
  isCompleted: boolean
}

const TrainingContext = createContext<TrainingContextType | null>(null)

export function useTraining() {
  const context = useContext(TrainingContext)
  if (!context) throw new Error('useTraining must be used within TrainingEngine')
  return context
}

interface TrainingEngineProps {
  program: TrainingProgram
  onComplete?: () => void
}

export default function TrainingEngine({ program, onComplete }: TrainingEngineProps) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'intro' | 'training' | 'complete'>('intro')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [phaseTimer, setPhaseTimer] = useState(0)
  const [totalTimer, setTotalTimer] = useState(0)
  const [startTime] = useState(Date.now())
  const { addTrainingRecord } = useAppStore()
  const handleCompleteRef = useRef<() => void>(() => {})

  useEffect(() => {
    handleCompleteRef.current = () => {
      setPhase('complete')
      setIsPlaying(false)
      addTrainingRecord({
        id: crypto.randomUUID(),
        type: program.title,
        duration: Math.floor((Date.now() - startTime) / 1000),
        completedAt: new Date().toISOString(),
      })
      onComplete?.()
    }
  }, [program.title, startTime, addTrainingRecord, onComplete])

  useEffect(() => {
    if (!isPlaying || phase !== 'training') return

    const interval = setInterval(() => {
      setPhaseTimer(t => t + 1)
      setTotalTimer(t => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, phase])

  useEffect(() => {
    if (!isPlaying || phase !== 'training') return

    if (phaseTimer >= (program.exercises[currentStep]?.duration || 60)) {
      if (currentStep < program.exercises.length - 1) {
        setCurrentStep(s => s + 1)
        setPhaseTimer(0)
      } else {
        handleCompleteRef.current()
      }
    }
  }, [phaseTimer, currentStep, isPlaying, phase, program.exercises])

  const goToNextStep = useCallback(() => {
    if (currentStep < program.exercises.length - 1) {
      setCurrentStep(s => s + 1)
      setPhaseTimer(0)
      setIsPlaying(false)
    } else {
      handleCompleteRef.current()
    }
  }, [currentStep, program.exercises.length])

  const togglePlay = useCallback(() => {
    if (phase === 'intro') {
      setPhase('training')
      setIsPlaying(true)
    } else {
      setIsPlaying(p => !p)
    }
  }, [phase])

  const complete = useCallback(() => {
    handleCompleteRef.current()
  }, [])

  const startTraining = () => {
    setPhase('training')
    setIsPlaying(true)
  }

  return (
    <TrainingContext.Provider
      value={{
        isPlaying,
        currentStep,
        totalSteps: program.exercises.length,
        phase,
        togglePlay,
        complete,
        isCompleted: phase === 'complete',
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-white">{program.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(m => !m)}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm text-slate-400">
              <span>步骤 {currentStep + 1} / {program.exercises.length}</span>
              <span>用时 {totalTimer}s</span>
            </div>

            <Progress
              value={(currentStep / program.exercises.length) * 100}
              className="h-2"
            />

            <AnimatePresence mode="wait">
              {phase === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <p className="text-slate-300">{program.description}</p>
                  <div className="flex gap-4">
                    <Button onClick={startTraining} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      开始训练
                    </Button>
                  </div>
                </motion.div>
              )}

              {phase === 'training' && (
                <motion.div
                  key="training"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-900/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {program.exercises[currentStep]?.title}
                    </h3>
                    <p className="text-slate-400 mb-4">
                      {program.exercises[currentStep]?.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={togglePlay}
                        className="flex-1"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            暂停
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            继续
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={goToNextStep}
                        disabled={currentStep >= program.exercises.length - 1}
                      >
                        <SkipForward className="w-5 h-5" />
                      </Button>
                    </div>

                    {program.exercises[currentStep]?.duration && (
                      <div className="mt-4">
                        <div className="text-sm text-slate-500 mb-1">
                          本步骤剩余时间
                        </div>
                        <div className="text-3xl font-bold text-indigo-400">
                          {Math.max(0, program.exercises[currentStep].duration - phaseTimer)}s
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {phase === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white">训练完成！</h3>
                  <p className="text-slate-400">
                    恭喜你完成了 {program.title} 训练
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate('/app/progress')}>
                      查看进度
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/app/training')}>
                      返回训练
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </TrainingContext.Provider>
  )
}
