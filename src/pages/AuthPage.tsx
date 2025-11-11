import React from 'react';
import AuthForm from '../components/AuthForm';

export const AuthPage: React.FC = () => {
    return (
        <div className="min-h-screen w-full py-12 px-6 lg:px-12 xl:px-20">
            <div className="w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Branding */}
                    <div className="hidden lg:block space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Tailor Your Resume
                                <span className="block text-primary-600 mt-2">Land Your Dream Job</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                AI-powered resume analysis that helps you stand out from the competition.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-primary-100">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Smart Matching</h3>
                                    <p className="text-gray-600">Match your resume to job description instantly</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-primary-100">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Detailed Analytics</h3>
                                    <p className="text-gray-600">Get actionable insights to improve your application</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-primary-100">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Lightning Fast</h3>
                                    <p className="text-gray-600">Analyze your resume in seconds, not hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Auth Form */}
                    <div className="w-full">
                        <AuthForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
