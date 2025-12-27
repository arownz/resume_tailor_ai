import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, DollarSign, LogIn, Sparkles, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navigation: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, loading, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        setUserMenuOpen(false);
    };

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

                        {!loading && !user && (
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 text-rose-700 hover:text-rose-900 transition-colors font-medium"
                            >
                                <LogIn className="w-5 h-5" />
                                Sign in
                            </Link>
                        )}

                        <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Tailor Resume
                        </Link>

                        {/* User Menu (when logged in) */}
                        {!loading && user && (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-200 hover:bg-rose-300 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {user.email?.split('@')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <hr className="my-2" />
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-red-600 w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
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

                            {/* Auth Section */}
                            {!loading && !user && (
                                <Link
                                    to="/auth"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Sign in
                                </Link>
                            )}

                            {!loading && user && (
                                <>
                                    <div className="px-4 py-2 border-t border-gray-200 mt-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {user.email?.split('@')[0]}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                                    >
                                        <User className="w-5 h-5" />
                                        Profile
                                    </Link>

                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                                    >
                                        <Settings className="w-5 h-5" />
                                        Settings
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50 w-full text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Sign Out
                                    </button>
                                </>
                            )}

                            <Link
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn-primary text-center flex items-center justify-center gap-2 mt-2"
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
