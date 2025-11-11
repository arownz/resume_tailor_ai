import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, DollarSign, LogIn, Sparkles } from 'lucide-react';

export const Navigation: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-rose-100 shadow-md sticky top-0 z-50 border-b-2 border-rose-300 w-full">
            <div className="w-full max-w-none px-6">
                <div className="flex items-center justify-between h-20 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src="/swiftly.png"
                            alt="Resumay Tailor Swift"
                            className="w-14 h-14 object-contain"
                            onError={(e) => {
                                const t = e.currentTarget as HTMLImageElement;
                                if (!t.dataset.fallback) {
                                    t.dataset.fallback = '1';
                                    t.src = '/swiftly.svg';
                                }
                            }}
                        />
                        <span className="text-2xl font-bold text-gray-900">
                            Resumay <span className="text-primary-600">Tailor Swift</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-rose-700 hover:text-rose-900 transition-colors font-medium"
                        >
                            <Home className="w-5 h-5" />
                            Home
                        </Link>
                        <Link
                            to="/pricing"
                            className="flex items-center gap-2 text-rose-700 hover:text-rose-900 transition-colors font-medium"
                        >
                            <DollarSign className="w-5 h-5" />
                            Pricing
                        </Link>
                        <Link
                            to="/auth"
                            className="flex items-center gap-2 text-rose-700 hover:text-rose-900 transition-colors font-medium"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign in
                        </Link>
                        <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Tailor Resume
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
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
                    <div className="lg:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col gap-4">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <Home className="w-5 h-5" />
                                Home
                            </Link>
                            <Link
                                to="/pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <DollarSign className="w-5 h-5" />
                                Pricing
                            </Link>
                            <Link
                                to="/auth"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign in
                            </Link>
                            <Link
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn-primary text-center flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Tailor Resume
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
