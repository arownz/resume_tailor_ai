import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { AuthPage } from './pages/AuthPage';
import { FileText, Menu, X } from 'lucide-react';
import MusicPlayer from './components/MusicPlayer';
import { useState } from 'react';
import './App.css';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-primary-600">
                <img src="/swiftly.png" alt="Resumay Tailor Swift" className="w-15 h-auto" />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Pricing
                </Link>
                <Link to="/auth" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Sign in
                </Link>
                <Link to="/dashboard" className="btn-primary">
                  Get started
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
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col gap-4">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6 text-primary-400" />
                  <span className="text-xl font-bold">Resumay Tailor Swift</span>
                </div>
                <p className="text-gray-400">
                  AI-powered resume analysis and tailoring — professional, clear, and recruiter-focused.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <div className="space-y-2 text-gray-400">
                  <p>Email: support@resumetailor.ai</p>
                  <p>Response time: 24-48 hours</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Resume Tailor AI. All rights reserved.</p>
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
