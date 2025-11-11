import React, { useState } from 'react';
import { SupabaseService } from '../services/supabase.service';
import { useNavigate } from 'react-router-dom';
import { Github, Mail, Lock } from 'lucide-react';

export const AuthForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const signInWithGitHub = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await SupabaseService.signInWithProvider('github');
            // Supabase will redirect to the callback URL configured in dashboard
            setSuccess('Redirecting to GitHub...');
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'GitHub sign-in failed. Please check your configuration.');
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
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await SupabaseService.signUp(email, password);
            setSuccess('Account created! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(`${message || 'Sign up failed'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl border-2 border-primary-100">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome</h2>
                <p className="text-gray-600 text-lg">Sign in to tailor your resume with AI magic</p>
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

            <div className="mb-8">
                <button

                    onClick={signInWithGitHub}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 border-2 border-gray-900 rounded-xl font-bold text-white hover:bg-gray-800 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-gray-500 shadow-lg text-lg cursor-pointer"
                >
                    <Github className="w-6 h-6" />
                    {loading ? 'Connecting...' : 'Continue with GitHub'}
                </button>
            </div>

            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-base">
                    <span className="px-6 bg-white text-gray-500 font-semibold">Or use email</span>
                </div>
            </div>

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
                <div className="flex flex-col gap-4 pt-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <button
                        type="button"
                        onClick={signUpWithEmail}
                        disabled={loading}
                        className="btn-secondary w-full text-lg py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all cursor-pointer"
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
                <p className="text-base text-gray-600 flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5 text-primary-600" />
                    Your data is encrypted and secure
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
