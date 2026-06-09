import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { Sidebar, MenuButton } from './components/Sidebar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageTransition } from './components/animations/AnimatedComponents';
import { TopProgressBar, PageLoader as NewPageLoader } from './components/Loading';
import { useAppStore } from './store';
import { getTranslation } from './i18n';
import './index.css';

const Assessments = lazy(() =>
  import('./pages/Assessments').then(m => ({ default: m.Assessments }))
);
const AssessmentDetail = lazy(() => import('./pages/AssessmentDetail'));
const History = lazy(() => import('./pages/History').then(m => ({ default: m.History })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Training = lazy(() => import('./pages/Training').then(m => ({ default: m.Training })));
const TrainingDetail = lazy(() => import('./pages/TrainingDetail'));
const MoodTracker = lazy(() =>
  import('./pages/MoodTracker').then(m => ({ default: m.MoodTracker }))
);
const Achievements = lazy(() =>
  import('./pages/Achievements').then(m => ({ default: m.Achievements }))
);
const CrisisResources = lazy(() =>
  import('./pages/CrisisResources').then(m => ({ default: m.CrisisResources }))
);
const CompareResults = lazy(() =>
  import('./pages/CompareResults').then(m => ({ default: m.CompareResults }))
);
const PersonalDashboard = lazy(() =>
  import('./components/dashboard/PersonalDashboard').then(m => ({ default: m.PersonalDashboard }))
);
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const SharedView = lazy(() => import('./pages/SharedView').then(m => ({ default: m.SharedView })));

function PageLoader() {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  return <NewPageLoader label={i18n.common.loading} />;
}

const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

function AnimatedRoutes() {
  const location = useLocation();

  // Fire custom events for TopProgressBar to advance / complete.
  useEffect(() => {
    window.dispatchEvent(new Event('mindmirror:route-start'));
    // Use rAF so the new page has a chance to mount before we
    // "complete" the transition — otherwise the bar fills too fast
    // and the new content flashes in after the bar fades.
    const id = requestAnimationFrame(() => {
      // Two frames: the first paints the new page, the second
      // confirms layout is stable.
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('mindmirror:route-end'));
      });
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition direction="up">
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/assessments"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <Assessments />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/assessments/:id"
          element={
            <PageTransition direction="left">
              <LazyRoute>
                <AssessmentDetail />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/training"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <Training />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/training/:id"
          element={
            <PageTransition direction="left">
              <LazyRoute>
                <TrainingDetail />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <PersonalDashboard />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/mood"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <MoodTracker />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/achievements"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <Achievements />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/crisis"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <CrisisResources />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/compare"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <CompareResults />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/history"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <History />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <Settings />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition direction="up">
              <LazyRoute>
                <About />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="/shared/:id"
          element={
            <PageTransition direction="fade">
              <LazyRoute>
                <SharedView />
              </LazyRoute>
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition direction="fade">
              <LazyRoute>
                <NotFound />
              </LazyRoute>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { locale } = useAppStore();
  const i18n = getTranslation(locale);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 bg-app-drift">
        <TopProgressBar />
        <ToastContainer />
        <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 safe-top">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                <motion.div
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  🧠
                </motion.div>
                <span>{i18n.app.name}</span>
              </Link>

              <div className="hidden md:flex items-center gap-5">
                {[
                  { to: '/', label: i18n.nav.home },
                  { to: '/assessments', label: i18n.nav.assessments },
                  { to: '/training', label: i18n.nav.training },
                  { to: '/dashboard', label: i18n.nav.dashboard },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="relative text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
                  >
                    {item.label}
                    {location.pathname === item.to && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                        layoutId="navIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
                <LanguageSwitcher />
              </div>

              <div className="flex items-center gap-3 md:hidden">
                <LanguageSwitcher />
                <MenuButton />
              </div>
            </div>
          </div>
        </nav>

        <Sidebar />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <AnimatedRoutes />
        </main>

        <footer className="mt-auto border-t border-slate-200 py-6 sm:py-10 bg-white/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-slate-500">
            <p className="text-sm sm:text-lg">{i18n.app.copyright}</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
