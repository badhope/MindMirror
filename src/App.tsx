import { Suspense, useEffect, lazy } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { PageSkeleton } from './components/Loading'
import GlobalMenu from './components/GlobalMenu'
import { I18nProvider } from './i18n'
import { useAppStore } from './store'
import ErrorBoundary from './components/ErrorBoundary'
import QuickSearchModal from './components/QuickSearchModal'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'
import ShortcutInitializer from './components/ShortcutInitializer'
import { ToastProvider } from './components/ui/Toast'
import { ShortcutProvider } from './components/ShortcutProvider'

import AppLayout from './app/layout/AppLayout'
import HomePage from './app/pages/HomePage'

// 首屏之外的页面使用动态导入（懒加载）
const Daily = lazy(() => import('./app/pages/Daily'))
const AssessmentsPage = lazy(() => import('./app/pages/AssessmentsPage'))
const Training = lazy(() => import('./app/pages/Training'))
const Progress = lazy(() => import('./app/pages/Progress'))
const SettingsPage = lazy(() => import('./app/pages/SettingsPage'))
const GrowthDashboard = lazy(() => import('./app/pages/GrowthDashboard'))
const GettingStarted = lazy(() => import('./app/pages/GettingStarted'))
const UniversalTraining = lazy(() => import('./app/pages/training/UniversalTraining'))
const LibraryArticles = lazy(() => import('./app/pages/library/LibraryArticles'))
const ArticleDetail = lazy(() => import('./app/pages/library/ArticleDetail'))
const LibraryTools = lazy(() => import('./app/pages/library/LibraryTools'))
const LibraryResources = lazy(() => import('./app/pages/library/LibraryResources'))
const CommunityShare = lazy(() => import('./app/pages/community/CommunityShare'))
const CommunityDiscussion = lazy(() => import('./app/pages/community/CommunityDiscussion'))
const CommunityExpert = lazy(() => import('./app/pages/community/CommunityExpert'))
const GrowthTraining = lazy(() => import('./app/pages/growth/GrowthTraining'))
const GrowthHabits = lazy(() => import('./app/pages/growth/GrowthHabits'))
const ModeSelectPage = lazy(() => import('./app/pages/assessment/ModeSelectPage'))
const AssessmentConfirmPage = lazy(() => import('./app/pages/assessment/AssessmentConfirmPage'))
const LoadingPage = lazy(() => import('./app/pages/assessment/LoadingPage'))
const ResultsPage = lazy(() => import('./app/pages/assessment/ResultsPage'))
const DashboardPage = lazy(() => import('./app/pages/DashboardPage'))
const ProfilePage = lazy(() => import('./app/pages/ProfilePage'))
const AboutPage = lazy(() => import('./app/pages/AboutPage'))
const LeaderboardPage = lazy(() => import('./app/pages/LeaderboardPage'))
const SoulMatchPage = lazy(() => import('./app/pages/SoulMatchPage'))
const TheoryDetailPage = lazy(() => import('./app/pages/TheoryDetailPage'))
const PhilosophyHistoryPage = lazy(() => import('./app/pages/PhilosophyHistoryPage'))
const PsychologyHistoryPage = lazy(() => import('./app/pages/PsychologyHistoryPage'))
const IdeologyHistoryPage = lazy(() => import('./app/pages/IdeologyHistoryPage'))
const IsmsPage = lazy(() => import('./app/pages/IsmsPage'))
const PlatformStoryPage = lazy(() => import('./app/pages/PlatformStoryPage'))
const AssessmentPage = lazy(() => import('./app/pages/AssessmentPage'))
const OnePieceModeSelectPage = lazy(() => import('./app/pages/OnePieceModeSelectPage'))
const NotFoundPage = lazy(() => import('./app/pages/NotFoundPage'))

export default function App() {
  const theme = useAppStore((state) => state.theme)
  const location = useLocation()
  
  const isNewApp = location.pathname.startsWith('/app')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <I18nProvider>
      <ErrorBoundary>
        <ToastProvider>
          <ShortcutProvider>
            <div className="min-h-screen bg-slate-900 text-white">
              <ShortcutInitializer />
              
              {!isNewApp && <GlobalMenu />}
              {!isNewApp && <QuickSearchModal />}
              {!isNewApp && <KeyboardShortcutsHelp />}

              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/app/home" replace />} />

                  <Route path="/app" element={<AppLayout title="心镜" />}>
                    <Route path="home" element={<HomePage />} />
                    <Route path="daily" element={<Daily />} />
                    <Route path="assessments" element={<AssessmentsPage />} />
                    <Route path="assessment/:id/mode-select" element={<ModeSelectPage />} />
                    <Route path="assessment/:id/confirm" element={<AssessmentConfirmPage />} />
                    <Route path="assessment/:id/take" element={<AssessmentPage />} />
                    <Route path="assessment/:id" element={<ModeSelectPage />} />
                    <Route path="loading/:id" element={<LoadingPage />} />
                    <Route path="results/:id" element={<ResultsPage />} />
                    <Route path="onepiece" element={<OnePieceModeSelectPage />} />
                    <Route path="training" element={<Training />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="soul-match" element={<SoulMatchPage />} />
                    <Route path="theory/:theoryId" element={<TheoryDetailPage />} />
                    <Route path="history/philosophy" element={<PhilosophyHistoryPage />} />
                    <Route path="history/psychology" element={<PsychologyHistoryPage />} />
                    <Route path="history/ideology" element={<IdeologyHistoryPage />} />
                    <Route path="isms" element={<IsmsPage />} />
                    <Route path="story" element={<PlatformStoryPage />} />
                    <Route path="getting-started" element={<GettingStarted />} />
                    <Route path="library" element={<LibraryArticles />} />
                    <Route path="library/articles" element={<LibraryArticles />} />
                    <Route path="library/article/:id" element={<ArticleDetail />} />
                    <Route path="library/tools" element={<LibraryTools />} />
                    <Route path="library/resources" element={<LibraryResources />} />
                    <Route path="community" element={<CommunityShare />} />
                    <Route path="community/share" element={<CommunityShare />} />
                    <Route path="community/discussion" element={<CommunityDiscussion />} />
                    <Route path="community/expert" element={<CommunityExpert />} />
                    <Route path="growth" element={<GrowthDashboard />} />
                    <Route path="growth/training" element={<GrowthTraining />} />
                    <Route path="growth/habits" element={<GrowthHabits />} />
                    <Route path="training/:programId" element={<UniversalTraining />} />
                  </Route>

                  <Route path="/app/discover" element={<Navigate to="/app/assessments" replace />} />
                  <Route path="/assessments" element={<Navigate to="/app/assessments" replace />} />
                  <Route path="/categories" element={<Navigate to="/app/assessments" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
          </ShortcutProvider>
        </ToastProvider>
      </ErrorBoundary>
    </I18nProvider>
  )
}