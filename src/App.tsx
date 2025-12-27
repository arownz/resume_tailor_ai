import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-linear-to-br from-rose-50 via-pink-50 to-rose-100">
          <Navigation />
          <main className="flex-1 w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-700 text-xl font-medium">Loading...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <MusicPlayer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
