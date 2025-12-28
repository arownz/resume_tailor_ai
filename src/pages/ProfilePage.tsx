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
                <div className="card">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
                        <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
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
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                                </h2>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>

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
