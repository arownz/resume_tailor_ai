import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading, signOut } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth');
        }
    }, [loading, user, navigate]);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full py-12">
            <div className="w-full px-6 lg:px-12 xl:px-20">
                {/* Large Profile Initial Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white">
                        {(user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">
                        {user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <p className="text-gray-600">{user?.email}</p>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">Account Details</h2>
                        <button
                            onClick={handleSignOut}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    {/* Profile Information */}
                    <div className="space-y-6">

                        {/* Account Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                </div>
                                <p className="text-gray-700">{user?.email}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <User className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-semibold text-gray-900">Provider</h3>
                                </div>
                                <p className="text-gray-700 capitalize">
                                    {user?.app_metadata?.provider || 'Email'}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-semibold text-gray-900">Member Since</h3>
                                </div>
                                <p className="text-gray-700">
                                    {user?.created_at
                                        ? new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : 'N/A'
                                    }
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-semibold text-gray-900">Account Status</h3>
                                </div>
                                <p className="text-green-600 font-semibold">Active</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Tailor Resume
                                </button>
                                {/* <button
                                    onClick={() => navigate('/pricing')}
                                    className="btn-secondary"
                                >
                                    View Pricing
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
