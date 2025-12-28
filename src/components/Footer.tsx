import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, Home, LogIn, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Footer: React.FC = () => {
    const { user, loading } = useAuth();

    return (
        <footer className="bg-gradient-to-br from-rose-200 via-rose-50 to-rose-200 mt-auto w-full">
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/swiftly.png"
                                alt="Resumay Tailor Swift"
                                className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
                                onError={(e) => {
                                    const t = e.currentTarget as HTMLImageElement;
                                    if (!t.dataset.fallback) {
                                        t.dataset.fallback = '1';
                                        t.src = '/swiftly.png';
                                    }
                                }}
                            />
                            <span className="text-lg sm:text-2xl font-bold text-gray-900 hidden sm:inline">
                                Resumay <span className="text-primary-600">Tailor Swift</span>
                            </span>
                            <span className="text-base font-bold text-gray-900 sm:hidden">
                                Resumay <span className="text-primary-600">TS</span>
                            </span>
                        </div>
                        <p className="text-rose-700 leading-relaxed">
                            AI-powered resume analysis and tailoring — professional, clear, and recruiter-focused.
                        </p>
                        <p className="text-rose-500 mt-4 text-sm italic font-medium">
                            Tailor for laziness
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-semibold mb-6 text-rose-800 italic">Quick Navigations</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-3 text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                                >
                                    <Home className="w-5 h-5 shrink-0 text-rose-900" />
                                    Home
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    to="/pricing"
                                    className="inline-flex items-center gap-3 text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                                >
                                    <DollarSign className="w-5 h-5 shrink-0 text-rose-900" />
                                    Pricing
                                </Link>
                            </li> */}
                            {!loading && !user ? (
                                <li>
                                    <Link
                                        to="/auth"
                                        className="inline-flex items-center gap-3 text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                                    >
                                        <LogIn className="w-5 h-5 shrink-0 text-rose-900" />
                                        Sign in
                                    </Link>
                                </li>
                            ) : !loading && user ? (
                                <li>
                                    <Link
                                        to="/profile"
                                        className="inline-flex items-center gap-3 text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                                    >
                                        <User className="w-5 h-5 shrink-0 text-rose-900" />
                                        Profile
                                    </Link>
                                </li>
                            ) : null}
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-semibold mb-6 text-rose-800 italic">Support</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Mail className="w-5 h-5 shrink-0 text-rose-900" />
                                <div>
                                    <p className="text-sm text-rose-700 font-medium">Email:</p>
                                    <a
                                        href="mailto:solodabu@gmail.com"
                                        className="text-rose-800 hover:text-rose-900 font-medium transition-colors underline"
                                    >
                                        pasionharold01@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Clock className="w-5 h-5 shrink-0 text-rose-900" />
                                <div>
                                    <p className="text-sm text-rose-700 font-medium">Response time:</p>
                                    <p className="text-rose-800 font-medium">12-24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-rose-200 pt-8 text-center">
                    <p className="text-rose-700 font-medium">
                        &copy; {new Date().getFullYear()} Resumay Tailor Swift. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
