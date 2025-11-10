import React, { useState } from 'react';
import { SupabaseService } from '../services/supabase.service';
import { useNavigate } from 'react-router-dom';
import { Chrome, Github, Mail, Lock, Sparkles } from 'lucide-react';

export const AuthForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const signInWithProvider = async (provider: 'google' | 'github') => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await SupabaseService.signInWithProvider(provider);
            // Supabase will redirect to the callback URL configured in dashboard
            setSuccess(`Redirecting to ${provider}...`);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'OAuth sign-in failed. Please check your Supabase OAuth configuration.');
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await SupabaseService.signIn(email, password);
            setSuccess('Welcome back! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await SupabaseService.signUp(email, password);
            setSuccess('✨ Account created! Please check your email to verify.');
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl border-2 border-primary-100">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2"> Welcome</h2>
                <p className="text-gray-600">Sign in to tailor your resume with AI magic</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        {error}
                    </p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        {success}
                    </p>
                </div>
            )}

            <div className="space-y-3 mb-6">
                <button
                    onClick={() => signInWithProvider('google')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-primary-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                    <Chrome className="w-5 h-5" />
                    Continue with Google
                </button>
                <button
                    onClick={() => signInWithProvider('github')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-900 border-2 border-gray-900 rounded-lg font-semibold text-white hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                >
                    <Github className="w-5 h-5" />
                    Continue with GitHub
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or use email</span>
                </div>
            </div>

            <form onSubmit={signInWithEmail} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                    </label>
                    <input
                        className="input-field"
                        type="email"
                        aria-label="Email"
                        placeholder="taylor@swift.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Password
                    </label>
                    <input
                        className="input-field"
                        aria-label="Password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 btn-lg"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <button
                        type="button"
                        onClick={signUpWithEmail}
                        disabled={loading}
                        className="btn-secondary btn-lg"
                    >
                        {loading ? 'Creating...' : 'Sign up'}
                    </button>
                </div>
            </form>

            <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                    Your data is encrypted
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
