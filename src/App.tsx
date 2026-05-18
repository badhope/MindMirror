import { Suspense, useEffect } from 'react'
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
import Daily from './app/pages/Daily'
import AssessmentsPage from './app/pages/AssessmentsPage'
import Training from './app/pages/Training'
import Progress from './app/pages/Progress'
import SettingsPage from './app/pages/SettingsPage'
import GrowthDashboard from './app/pages/GrowthDashboard'
import GettingStarted from './app/pages/GettingStarted'
import UniversalTraining from './app/pages/training/UniversalTraining'
import LibraryArticles from './app/pages/library/LibraryArticles'
import ArticleDetail from './app/pages/library/ArticleDetail'
import LibraryTools from './app/pages/library/LibraryTools'
import LibraryResources from './app/pages/library/LibraryResources'
import CommunityShare from './app/pages/community/CommunityShare'
import CommunityDiscussion from './app/pages/community/CommunityDiscussion'
import CommunityExpert from './app/pages/community/CommunityExpert'
import GrowthTraining from './app/pages/growth/GrowthTraining'
import GrowthHabits from './app/pages/growth/GrowthHabits'
import { ModeSelectPage } from './app/pages/assessment'
import { AssessmentConfirmPage } from './app/pages/assessment'
import { LoadingPage } from './app/pages/assessment'
import { ResultsPage } from './app/pages/assessment'
import DashboardPage from './app/pages/DashboardPage'
import ProfilePage from './app/pages/ProfilePage'
import AboutPage from './app/pages/AboutPage'
import LeaderboardPage from './app/pages/LeaderboardPage'
import SoulMatchPage from './app/pages/SoulMatchPage'
import TheoryDetailPage from './app/pages/TheoryDetailPage'
import PhilosophyHistoryPage from './app/pages/PhilosophyHistoryPage'
import PsychologyHistoryPage from './app/pages/PsychologyHistoryPage'
import IdeologyHistoryPage from './app/pages/IdeologyHistoryPage'
import IsmsPage from './app/pages/IsmsPage'
import PlatformStoryPage from './app/pages/PlatformStoryPage'
import AssessmentPage from './app/pages/AssessmentPage'
import OnePieceModeSelectPage from './app/pages/OnePieceModeSelectPage'
import NotFoundPage from './app/pages/NotFoundPage'

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
