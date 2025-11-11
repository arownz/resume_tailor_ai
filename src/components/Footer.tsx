import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, Home, DollarSign, LogIn } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-br from-rose-300 via-rose-50 to-rose-300 mt-auto w-full">
            <div className="w-full max-w-none px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8 w-full">
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
                            Tailor for job seekers
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-rose-800">Quick Links</h3>
                        <div className="space-y-3">
                            <Home className="w-5 h-5 flex-shrink-0 mt-1 text-rose-900" />
                            <Link
                                to="/"
                                className="block text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                            >
                                Home
                            </Link>
                            <DollarSign className="w-5 h-5 flex-shrink-0 mt-1 text-rose-900" />
                            <Link
                                to="/pricing"
                                className="block text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                            >
                                Pricing
                            </Link>
                            <LogIn className="w-5 h-5 flex-shrink-0 mt-1 text-rose-900" />
                            <Link
                                to="/auth"
                                className="block text-rose-800 hover:text-rose-900 font-medium transition-colors hover:translate-x-1 transform duration-200"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-rose-800">Support</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 flex-shrink-0 mt-1 text-rose-900" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-rose-700 font-medium">Email:</p>
                                    <a
                                        href="mailto:pasionharold252002@gmail.com"
                                        className="text-rose-800 hover:text-rose-900 font-medium transition-colors break-all"
                                    >
                                        pasionharold252002@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 flex-shrink-0 mt-1 text-rose-900" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-rose-700 font-medium">Response time:</p>
                                    <p className="text-rose-800 hover:text-rose-900 font-medium">24-48 hours</p>
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
