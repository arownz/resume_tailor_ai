import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Github, Mail, Lock, User } from 'lucide-react';

type AuthTab = 'signin' | 'signup';

export const AuthForm: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AuthTab>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const { signIn, signUp, signInWithGitHub } = useAuth();

    const switchTab = (tab: AuthTab) => {
        setActiveTab(tab);
        setError(null);
        setSuccess(null);
        // Clear form fields when switching tabs
        if (tab === 'signin') {
            setUsername('');
            setConfirmPassword('');
        }
    };

    const handleGitHubSignIn = async () => {
        setLocalLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await signInWithGitHub();
            setSuccess('Redirecting to GitHub...');
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'GitHub sign-in failed. Please check your configuration.');
        } finally {
            setLocalLoading(false);
        }
    };

    const signInWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        setLocalLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await signIn(email, password);
            setSuccess('Welcome back! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Sign in failed');
        } finally {
            setLocalLoading(false);
        }
    };

    const signUpWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLocalLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await signUp(email, password, username);
            setSuccess('Account created! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(`${message || 'Sign up failed'}`);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl border-2 border-gray-500">
            <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome</h2>
                <p className="text-gray-600 text-lg">
                    {activeTab === 'signin' 
                        ? 'Sign in to tailor your resume with AI magic' 
                        : 'Create an account to get started'}
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                <button
                    type="button"
                    onClick={() => switchTab('signin')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all cursor-pointer ${
                        activeTab === 'signin'
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={() => switchTab('signup')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all cursor-pointer ${
                        activeTab === 'signup'
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Sign Up
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                        {error}
                    </p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                        {success}
                    </p>
                </div>
            )}

            <div className="mb-6">
                <button
                    onClick={handleGitHubSignIn}
                    disabled={localLoading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 border-2 border-gray-900 rounded-xl font-bold text-white hover:bg-gray-800 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-gray-500 shadow-lg text-lg cursor-pointer"
                >
                    <Github className="w-6 h-6" />
                    {localLoading ? 'Connecting...' : `Continue with GitHub`}
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-base">
                    <span className="px-6 bg-white text-gray-500 font-semibold">Or use email</span>
                </div>
            </div>

            {/* Sign In Form */}
            {activeTab === 'signin' && (
                <form onSubmit={signInWithEmail} className="space-y-5">
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-3">
                            <Mail className="w-5 h-5 inline mr-2" />
                            Email
                        </label>
                        <input
                            className="input-field text-lg"
                            type="email"
                            aria-label="Email"
                            placeholder="taylor@swift.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-3">
                            <Lock className="w-5 h-5 inline mr-2" />
                            Password
                        </label>
                        <input
                            className="input-field text-lg"
                            aria-label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={localLoading}
                            className="btn-primary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                            {localLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
                <form onSubmit={signUpWithEmail} className="space-y-4">
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            <User className="w-5 h-5 inline mr-2" />
                            Username
                        </label>
                        <input
                            className="input-field text-lg"
                            type="text"
                            aria-label="Username"
                            placeholder="swiftie13"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            <Mail className="w-5 h-5 inline mr-2" />
                            Email
                        </label>
                        <input
                            className="input-field text-lg"
                            type="email"
                            aria-label="Email"
                            placeholder="taylor@swift.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            <Lock className="w-5 h-5 inline mr-2" />
                            Password
                        </label>
                        <input
                            className="input-field text-lg"
                            aria-label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            <Lock className="w-5 h-5 inline mr-2" />
                            Confirm Password
                        </label>
                        <input
                            className="input-field text-lg"
                            aria-label="Confirm Password"
                            placeholder="••••••••"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={localLoading}
                            className="btn-primary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                            {localLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-6 pt-5 border-t-2 border-gray-100 text-center">
                <p className="text-base text-gray-600 flex items-center justify-center gap-2">
                    Your data is encrypted and secure in supabase
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
