import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { FileText, Menu, X, Home, LayoutDashboard, DollarSign, LogIn, Sparkles } from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';
import './App.css';

// Lazy-load route components for code-splitting
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 shadow-lg sticky top-0 z-50 border-b-2 border-rose-200">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 text-xl font-bold text-primary-600 hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-rose-400 to-pink-500 p-2 rounded-xl shadow-md">
                  <img
                    src="/swiftly.png"
                    alt="Resumay Tailor Swift"
                    className="w-10 h-10"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (!t.dataset.fallback) {
                        t.dataset.fallback = '1';
                        t.src = '/swiftly.svg';
                      }
                    }}
                  />
                </div>
                <span className="text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Resumay Tailor Swift
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/pricing" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-all hover:scale-105 font-medium">
                  <DollarSign className="w-4 h-4" />
                  Pricing
                </Link>
                <Link to="/auth" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-all hover:scale-105 font-medium">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
                <Link to="/dashboard" className="btn-primary flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  Tailor Resumay
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-6 border-t border-rose-200 bg-white/90 backdrop-blur-sm">
                <div className="flex flex-col gap-4">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-2 py-2 rounded-lg hover:bg-rose-50"
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-2 py-2 rounded-lg hover:bg-rose-50"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-2 py-2 rounded-lg hover:bg-rose-50"
                  >
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-2 py-2 rounded-lg hover:bg-rose-50"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign in
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-center flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Resume Analysis
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-50">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-rose-200 border-t-primary-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-700 text-xl font-medium">Loading your experience...</p>
                <p className="text-gray-500 text-sm mt-2">Getting things ready for you</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-rose-900 via-pink-900 to-rose-800 text-white py-16 mt-16 border-t-4 border-rose-400">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <FileText className="w-8 h-8 text-rose-200" />
                  </div>
                  <span className="text-2xl font-bold">Resumay Tailor Swift</span>
                </div>
                <p className="text-rose-100 leading-relaxed text-lg">
                  AI-powered resume analysis and tailoring swiftly and recruiter-focused.
                </p>
                <p className="mt-4 text-rose-200 text-sm font-bold">
                  Tailor for job seekers
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-6 text-xl flex items-center gap-2">
                  Navigations
                </h3>
                <div className="space-y-3">
                  <Link to="/" className="flex items-center gap-2 text-rose-100 hover:text-white transition-all hover:translate-x-1 text-lg">
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link to="/auth" className="flex items-center gap-2 text-rose-100 hover:text-white transition-all hover:translate-x-1 text-lg">
                    <LogIn className="w-5 h-5" />
                    Sign in
                  </Link>
                  <Link to="/pricing" className="flex items-center gap-2 text-rose-100 hover:text-white transition-all hover:translate-x-1 text-lg">
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-6 text-xl flex items-center gap-2">
                  Support
                </h3>
                <div className="space-y-4 text-rose-100 text-lg">
                  <p className="flex items-start gap-2">
                    <span>Email: pasionharold252002@gmail.com</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span>Response time: 24-48 hours</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-rose-700 pt-8 text-center">
              <p className="text-rose-200 text-lg">
                &copy; {new Date().getFullYear()} Resumay Tailor Swift. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Global persistent music player (fixed) */}
        <MusicPlayer />
      </div>
    </Router>
  );
}

export default App;
