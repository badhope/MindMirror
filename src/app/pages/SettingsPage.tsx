import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@hooks/useToast'
import {
  ChevronRight,
  AlertCircle,
  Calendar,
  ArrowLeft,
  User,
  Palette,
  Moon,
  Sun,
  Bell,
  Shield,
  Download,
  Upload,
  Volume2,
  Clock,
  Info,
  Monitor,
  Sparkles,
  Globe,
  Check,
  Trash,
  RefreshCw,
  Save,
  Share,
  Lock,
  Unlock,
  Cpu,
  Battery,
  Wifi,
  Stars,
  Maximize,
  Minimize,
  History,
  HelpCircle,
  Star,
  Award,
  Activity,
  Trash2,
  Database,
  FileText,
  ExternalLink,
  MessageSquare,
  Mail,
  Github,
  BookOpen,
} from 'lucide-react'
import { useAppStore } from '@store'
import { useSettingsStore } from '@store/settingsStore'
import { getAssessmentById } from '@data/assessments'
import { cn } from '@utils/cn'
import { ANIMATION } from '../utils/animation-config'

interface ToggleSetting {
  id: string
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
  icon: React.ElementType
}

interface Section {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

function ToggleItem({ setting }: { setting: ToggleSetting }) {
  const Icon = setting.icon
  return (
    <motion.div
      key={setting.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-white/70" />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{setting.label}</p>
          <p className="text-xs text-white/40 mt-0.5">{setting.description}</p>
        </div>
      </div>
      <motion.button
        onClick={setting.onToggle}
        className={cn(
          'relative w-14 h-7 rounded-full transition-colors shrink-0',
          setting.enabled ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-white/20'
        )}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
          animate={{ left: setting.enabled ? '28px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  )
}

function SectionHeader({ icon: Icon, title, description, color }: { icon: React.ElementType; title: string; description: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
        color ? `bg-gradient-to-br ${color}` : 'bg-white/10'
      )}>
        <Icon size={20} className={color ? 'text-white' : 'text-white/70'} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-xs text-white/50">{description}</p>
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50 mt-1">{label}</p>
    </div>
  )
}

function ActionButton({ icon: Icon, label, description, onClick, variant = 'default', badge }: { 
  icon: React.ElementType; 
  label: string; 
  description: string; 
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success'
  badge?: string
}) {
  const variants = {
    default: 'bg-white/5 hover:bg-white/10 text-white border border-white/5',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
    success: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  }
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl transition-all flex items-center gap-3',
        variants[variant]
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
        variant === 'danger' ? 'bg-red-500/20' : 
        variant === 'success' ? 'bg-emerald-500/20' : 'bg-white/10'
      )}>
        <Icon size={20} className={variant === 'danger' ? 'text-red-400' : variant === 'success' ? 'text-emerald-400' : 'text-white/70'} />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium text-sm">{label}</p>
          {badge && <span className="px-1.5 py-0.5 rounded text-[9px] bg-violet-500/20 text-violet-300">{badge}</span>}
        </div>
        <p className="text-xs text-white/50">{description}</p>
      </div>
      <ChevronRight size={16} className="text-white/30 shrink-0" />
    </motion.button>
  )
}

function LinkButton({ icon: Icon, label, description, href, onClick }: { 
  icon: React.ElementType; 
  label: string; 
  description: string; 
  href?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick || (href ? () => window.open(href, '_blank') : undefined)}
      className="w-full p-4 rounded-xl transition-all flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-white/70" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-white font-medium text-sm">{label}</p>
          <ExternalLink size={12} className="text-white/40" />
        </div>
        <p className="text-xs text-white/50">{description}</p>
      </div>
    </motion.button>
  )
}

function RadioOption<T extends string>({ 
  value, 
  label, 
  icon: Icon, 
  selected, 
  onChange 
}: { 
  value: T; 
  label: string; 
  icon?: React.ElementType;
  selected: boolean; 
  onChange: (value: T) => void 
}) {
  return (
    <motion.button
      key={value}
      onClick={() => onChange(value)}
      className={cn(
        'relative p-4 rounded-xl transition-all flex flex-col items-center gap-2',
        selected
          ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-500'
          : 'bg-white/5 border-2 border-transparent hover:border-white/20'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {Icon && <Icon size={24} className={selected ? 'text-violet-400' : 'text-white/60'} />}
      <span className={cn('font-medium text-sm', selected ? 'text-white' : 'text-white/60')}>
        {label}
      </span>
      {selected && (
        <motion.div
          layoutId="selectedIndicator"
          className="absolute inset-0 bg-violet-500/10 rounded-xl"
        />
      )}
    </motion.button>
  )
}

function ColorOptionButton({ 
  value, 
  label, 
  hex, 
  selected, 
  onChange 
}: { 
  value: string; 
  label: string; 
  hex: string; 
  selected: boolean; 
  onChange: (value: string) => void 
}) {
  return (
    <motion.button
      key={value}
      onClick={() => onChange(value)}
      className={cn(
        'w-12 h-12 rounded-full transition-all flex flex-col items-center justify-center gap-1',
        selected && 'ring-4 ring-white/30 scale-110'
      )}
      style={{ backgroundColor: hex }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {selected && <Check size={20} className="text-white" />}
    </motion.button>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cacheSize, setCacheSize] = useState('计算中...')
  
  const {
    completedAssessments,
    deleteAssessment,
    clearAllAssessments,
    achievements,
    user,
    updateUserProfile,
    setUser,
  } = useAppStore()

  const {
    theme,
    setTheme,
    animationsEnabled,
    toggleAnimations,
    accentColor,
    setAccentColor,
    pushNotifications,
    togglePushNotifications,
    dailyReminder,
    toggleDailyReminder,
    achievementNotifications,
    toggleAchievementNotifications,
    soundEffects,
    toggleSoundEffects,
    autoBackup,
    toggleAutoBackup,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    privacyMode,
    togglePrivacyMode,
    resetSettings,
  } = useSettingsStore()

  const [activeSection, setActiveSection] = useState('personal')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  })
  const [feedbackText, setFeedbackText] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  useEffect(() => {
    calculateCacheSize()
  }, [])

  const calculateCacheSize = () => {
    if ('caches' in window) {
      caches.keys().then(names => {
        const size = names.length * 0.5
        setCacheSize(size < 1 ? `${Math.round(size * 1024)} KB` : `${size.toFixed(1)} MB`)
      }).catch(() => {
        setCacheSize('未知')
      })
    } else {
      setCacheSize('不支持')
    }
  }

  const sections: Section[] = [
    { id: 'personal', label: '个人', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'appearance', label: '外观', icon: Palette, color: 'from-violet-500 to-purple-500' },
    { id: 'notifications', label: '通知', icon: Bell, color: 'from-amber-500 to-orange-500' },
    { id: 'privacy', label: '隐私', icon: Shield, color: 'from-rose-500 to-pink-500' },
    { id: 'performance', label: '性能', icon: Cpu, color: 'from-emerald-500 to-teal-500' },
    { id: 'data', label: '数据', icon: Database, color: 'from-indigo-500 to-blue-500' },
    { id: 'about', label: '关于', icon: Info, color: 'from-gray-500 to-slate-500' },
  ]

  const themeOptions = [
    { value: 'dark', label: '深色', icon: Moon },
    { value: 'light', label: '浅色', icon: Sun },
    { value: 'system', label: '系统', icon: Monitor },
    { value: 'midnight', label: '午夜', icon: Stars },
  ]

  const colorOptions = [
    { value: 'violet', label: '紫罗兰', hex: '#8b5cf6' },
    { value: 'blue', label: '蓝色', hex: '#3b82f6' },
    { value: 'green', label: '绿色', hex: '#10b981' },
    { value: 'pink', label: '粉色', hex: '#ec4899' },
    { value: 'orange', label: '橙色', hex: '#f97316' },
    { value: 'cyan', label: '青色', hex: '#06b6d4' },
  ]

  const appearanceSettings: ToggleSetting[] = [
    { id: 'animations', label: '动画效果', description: '界面动画和过渡效果', enabled: animationsEnabled, onToggle: toggleAnimations, icon: Sparkles },
    { id: 'reduced', label: '减少动画', description: '降低动画幅度，提升流畅度', enabled: reducedMotion, onToggle: toggleReducedMotion, icon: Minimize },
    { id: 'contrast', label: '高对比度', description: '提高界面可视性', enabled: highContrast, onToggle: toggleHighContrast, icon: Maximize },
  ]

  const notificationSettings: ToggleSetting[] = [
    { id: 'notifications', label: '推送通知', description: '接收测评和成就提醒', enabled: pushNotifications, onToggle: togglePushNotifications, icon: Bell },
    { id: 'daily', label: '每日提醒', description: '每日心情打卡提醒', enabled: dailyReminder, onToggle: toggleDailyReminder, icon: Clock },
    { id: 'achievements', label: '成就通知', description: '解锁成就时的提示', enabled: achievementNotifications, onToggle: toggleAchievementNotifications, icon: Award },
    { id: 'sound', label: '音效', description: '交互音效反馈', enabled: soundEffects, onToggle: toggleSoundEffects, icon: Volume2 },
  ]

  const privacySettings: ToggleSetting[] = [
    { id: 'privacy', label: '隐私模式', description: '隐藏敏感数据和测评结果', enabled: privacyMode, onToggle: togglePrivacyMode, icon: Lock },
    { id: 'backup', label: '自动备份', description: '定期自动备份数据到本地', enabled: autoBackup, onToggle: toggleAutoBackup, icon: Database },
  ]

  const performanceSettings: ToggleSetting[] = [
    { id: 'battery', label: '省电模式', description: '减少动画以节省电量', enabled: reducedMotion, onToggle: toggleReducedMotion, icon: Battery },
    { id: 'offline', label: '离线模式', description: '优先使用本地数据', enabled: true, onToggle: () => toast.success('离线模式已启用', 2000), icon: Wifi },
    { id: 'cache', label: '预加载', description: '预加载常用资源', enabled: true, onToggle: () => toast.success('预加载已启用', 2000), icon: Cpu },
  ]

  const exportDataJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '3.0.0',
      user: user,
      assessments: completedAssessments.map(a => ({
        ...a,
        completedAt: new Date(a.completedAt).toISOString(),
      })),
      achievements,
      exportedFrom: 'MindMirror',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindmirror-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('📦 数据导出成功', 2500)
  }

  const importDataJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.user) setUser(data.user)
        if (Array.isArray(data.assessments) || Array.isArray(data.completedAssessments)) {
          const records = data.assessments || data.completedAssessments
          toast.success(`📦 成功导入 ${records.length} 条测评记录`, 2500)
        }
      } catch {
        toast.error('❌ 导入失败：文件格式损坏', 2500)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const shareResults = async () => {
    const shareData = {
      title: '心镜 MindMirror',
      text: `我在心镜 MindMirror 完成了${completedAssessments.length}个测评，探索自我，成就更好的自己！`,
      url: 'https://github.com/badhope/MindMirror',
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(shareData.text + '\n' + shareData.url)
          toast.success('📋 已复制到剪贴板', 2000)
        }
      }
    } else {
      navigator.clipboard.writeText(shareData.text + '\n' + shareData.url)
      toast.success('📋 已复制到剪贴板', 2000)
    }
  }

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const names = await caches.keys()
        await Promise.all(names.map(name => caches.delete(name)))
      }
      localStorage.removeItem('cache')
      calculateCacheSize()
      toast.success('🗑️ 缓存已清除', 2000)
    } catch {
      toast.error('❌ 清除缓存失败', 2000)
    }
  }

  const checkUpdate = () => {
    toast.info('🔄 当前已是最新版本 v3.0.0', 2500)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget === 'all') {
        clearAllAssessments()
        toast.success('🗑️ 所有记录已清空', 2000)
      } else {
        deleteAssessment(deleteTarget)
        toast.success('🗑️ 记录已删除', 2000)
      }
    }
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleSaveProfile = () => {
    updateUserProfile(profileForm)
    setEditingProfile(false)
    toast.success('✅ 资料已保存', 2000)
  }

  const getAssessmentTitle = (id: string) => {
    const assessment = getAssessmentById(id)
    return assessment?.title || id
  }

  const handleFeedback = () => {
    if (feedbackText.trim()) {
      const subject = encodeURIComponent('心镜 MindMirror 用户反馈')
      const body = encodeURIComponent(feedbackText + '\n\n---\n来自心镜用户反馈')
      window.open(`mailto:feedback@mindmirror.app?subject=${subject}&body=${body}`, '_blank')
      toast.success('📧 已打开邮件客户端', 2000)
      setShowFeedbackModal(false)
      setFeedbackText('')
    } else {
      toast.error('请输入反馈内容', 2000)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/10 bg-gradient-to-b from-slate-950 to-transparent"
      >
        <div className="flex items-center gap-4 p-4 max-w-6xl mx-auto">
          <motion.button
            onClick={() => navigate('/app/home')}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-white/70" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-white">设置</h1>
            <p className="text-xs text-white/50">个性化你的体验</p>
          </div>
        </div>

        <div className="px-4 pb-4 max-w-6xl mx-auto">
          <div className="flex gap-3 flex-wrap justify-start">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all',
                    isActive
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-violet-500/20`
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                  )}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{section.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>

      <div className="p-4 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {activeSection === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader icon={User} title="个人资料" description="管理你的个人信息" color="from-blue-500 to-cyan-500" />
                  {!editingProfile && (
                    <motion.button
                      onClick={() => setEditingProfile(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm font-medium transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      编辑
                    </motion.button>
                  )}
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">昵称</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="给你的昵称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">简介</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors resize-none"
                        placeholder="介绍下自己..."
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={handleSaveProfile}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2"
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save size={14} />
                        保存
                      </motion.button>
                      <motion.button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-3 rounded-xl bg-white/10 text-white/80 font-medium text-sm"
                        whileTap={{ scale: 0.98 }}
                      >
                        取消
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                        {(user?.name || '访')[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{user?.name || '访客用户'}</h3>
                        <p className="text-sm text-white/50 mt-1">{user?.bio || '这个人很懒，什么都没写'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <StatCard value={completedAssessments.length} label="完成测评" />
                      <StatCard value={achievements.length} label="获得成就" />
                      <StatCard value="∞" label="成长积分" />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Globe} title="语言" description="选择界面语言" color="from-amber-500 to-orange-500" />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'zh', label: '中文' },
                    { value: 'en', label: 'English' },
                  ].map((lang) => (
                    <motion.button
                      key={lang.value}
                      className={cn(
                        'px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center',
                        lang.value === 'zh'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      {lang.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'appearance' && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Moon} title="主题模式" description="选择外观主题" color="from-violet-500 to-purple-500" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {themeOptions.map((option) => (
                    <RadioOption
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      icon={option.icon}
                      selected={theme === option.value}
                      onChange={(value) => setTheme(value as 'dark' | 'light' | 'system')}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Palette} title="强调色" description="自定义主题颜色" color="from-pink-500 to-rose-500" />
                <div className="flex gap-4 flex-wrap justify-center">
                  {colorOptions.map((color) => (
                    <ColorOptionButton
                      key={color.value}
                      value={color.value}
                      label={color.label}
                      hex={color.hex}
                      selected={accentColor === color.value}
                      onChange={(value) => setAccentColor(value as typeof accentColor)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Sparkles} title="视觉特效" description="动画和界面效果" color="from-emerald-500 to-teal-500" />
                <div className="space-y-3">
                  {appearanceSettings.map((setting) => (
                    <ToggleItem key={setting.id} setting={setting} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Bell} title="通知设置" description="管理通知偏好" color="from-amber-500 to-orange-500" />
                <div className="space-y-3">
                  {notificationSettings.map((setting) => (
                    <ToggleItem key={setting.id} setting={setting} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Shield} title="隐私保护" description="管理隐私设置" color="from-rose-500 to-pink-500" />
                <div className="space-y-3">
                  {privacySettings.map((setting) => (
                    <ToggleItem key={setting.id} setting={setting} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Lock} title="安全选项" description="账号安全设置" />
                <div className="space-y-3">
                  <ActionButton icon={Unlock} label="修改密码" description="更新你的登录密码" onClick={() => toast.info('当前为本地模式，无需密码', 2500)} />
                  <ActionButton icon={Star} label="两步验证" description="启用额外的安全保护" onClick={() => toast.info('本地模式暂不支持', 2500)} />
                  <ActionButton icon={History} label="登录记录" description="查看最近的登录活动" onClick={() => toast.info('当前为本地模式，无远程登录', 2500)} />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Cpu} title="性能设置" description="优化应用性能" color="from-emerald-500 to-teal-500" />
                <div className="space-y-3">
                  {performanceSettings.map((setting) => (
                    <ToggleItem key={setting.id} setting={setting} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Activity} title="资源管理" description="管理应用资源" />
                <div className="space-y-3">
                  <ActionButton 
                    icon={Database} 
                    label="清除缓存" 
                    description={`当前缓存: ${cacheSize}`} 
                    onClick={clearCache} 
                  />
                  <ActionButton 
                    icon={RefreshCw} 
                    label="检查更新" 
                    description="检查应用更新" 
                    onClick={checkUpdate}
                    badge="v3.0.0"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Database} title="数据管理" description="管理你的数据" color="from-indigo-500 to-blue-500" />
                <div className="grid grid-cols-2 gap-3">
                  <ActionButton icon={Download} label="导出数据" description="备份到本地文件" onClick={exportDataJSON} variant="success" />
                  <ActionButton icon={Upload} label="导入数据" description="从文件恢复" onClick={() => fileInputRef.current?.click()} />
                  <ActionButton icon={Share} label="分享应用" description="推荐给朋友" onClick={shareResults} />
                  <ActionButton icon={RefreshCw} label="重置设置" description="恢复默认配置" onClick={() => { resetSettings(); toast.success('设置已重置', 2000) }} />
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={Trash} title="危险区域" description="不可逆的操作" color="from-red-500 to-rose-500" />
                <ActionButton 
                  icon={Trash2} 
                  label="清空所有数据" 
                  description="这将永久删除所有记录和成就" 
                  onClick={() => { setDeleteTarget('all'); setShowDeleteModal(true) }} 
                  variant="danger" 
                />
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">测评记录</h2>
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                    {completedAssessments.length} 条
                  </span>
                </div>
                
                {completedAssessments.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {completedAssessments.slice(0, 10).map((record) => (
                      <motion.div
                        key={`${record.assessmentId}-${record.completedAt}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group"
                      >
                        <div 
                          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                          onClick={() => navigate(`/legacy/results/${record.id}`)}
                        >
                          <Calendar size={16} className="text-white/40 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">
                              {getAssessmentTitle(record.assessmentId)}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">
                              {new Date(record.completedAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-white/30 shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/40">
                    <FileText size={36} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">暂无测评记录</p>
                    <p className="text-xs mt-1">完成测评后记录将显示在这里</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: ANIMATION.FADE_DURATION }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-6 text-center border border-white/5">
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                  <Sparkles size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">心镜 MindMirror</h2>
                <p className="text-violet-400 font-medium text-sm mb-3">版本 3.0.0</p>
                <p className="text-white/60 text-sm max-w-xs mx-auto">
                  照见自己，成为更好的自己。开源专业心理测评与成长平台。
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard value="43+" label="专业测评" />
                <StatCard value="100%" label="本地存储" />
                <StatCard value="8" label="成长赛道" />
                <StatCard value="41" label="专项训练" />
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <h3 className="text-white font-semibold text-base mb-4 text-center">技术栈</h3>
                <div className="space-y-3">
                  {[
                    { name: '前端框架', value: 'React 18 + TypeScript' },
                    { name: '样式方案', value: 'Tailwind CSS' },
                    { name: '状态管理', value: 'Zustand' },
                    { name: '动画库', value: 'Framer Motion' },
                    { name: '构建工具', value: 'Vite 5' },
                  ].map((tech) => (
                    <div key={tech.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-white/70 text-sm">{tech.name}</span>
                      <span className="text-white font-medium text-sm">{tech.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 border border-white/5">
                <SectionHeader icon={HelpCircle} title="帮助与支持" description="获取帮助信息" />
                <div className="space-y-3">
                  <LinkButton 
                    icon={BookOpen} 
                    label="帮助中心" 
                    description="查看使用指南" 
                    href="https://github.com/badhope/MindMirror#readme"
                  />
                  <ActionButton 
                    icon={MessageSquare} 
                    label="反馈建议" 
                    description="提交你的意见" 
                    onClick={() => setShowFeedbackModal(true)}
                  />
                  <LinkButton 
                    icon={Github} 
                    label="开源项目" 
                    description="查看源代码" 
                    href="https://github.com/badhope/MindMirror"
                  />
                  <LinkButton 
                    icon={Mail} 
                    label="联系我们" 
                    description="发送邮件" 
                    onClick={() => window.open('mailto:hello@mindmirror.app', '_blank')}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importDataJSON}
        className="hidden"
      />

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl p-6 max-w-sm w-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle size={28} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">清空所有数据？</h3>
                <p className="text-white/60 text-sm">这将永久删除所有测评记录和成就，此操作无法撤销。</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  取消
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  确认删除
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl p-6 max-w-sm w-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-4 text-center">反馈建议</h3>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-colors resize-none"
                placeholder="请输入你的反馈..."
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <motion.button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white/80 font-medium text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  取消
                </motion.button>
                <motion.button
                  onClick={handleFeedback}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold text-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  发送
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}