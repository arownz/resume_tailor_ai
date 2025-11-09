import React, { useState } from 'react';
import { SupabaseService } from '../services/supabase.service';

export const AuthForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signInWithProvider = async (provider: 'google' | 'github') => {
        setLoading(true);
        setError(null);
        try {
            await SupabaseService.signInWithProvider(provider);
            // Supabase will redirect to the callback URL configured in dashboard
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'OAuth sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await SupabaseService.signIn(email, password);
            // handle post sign-in UI changes elsewhere
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await SupabaseService.signUp(email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Sign in / Sign up</h2>
            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
            <div className="space-y-3 mb-4">
                <button onClick={() => signInWithProvider('google')} disabled={loading} className="btn-primary w-full">
                    Continue with Google
                </button>
                <button onClick={() => signInWithProvider('github')} disabled={loading} className="btn-secondary w-full">
                    Continue with GitHub
                </button>
            </div>

            <form onSubmit={signInWithEmail} className="space-y-3">
                <input className="input-field" aria-label="Email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="input-field" aria-label="Password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="btn-primary flex-1">Sign in</button>
                    <button type="button" onClick={signUpWithEmail} disabled={loading} className="btn-secondary">Sign up</button>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;
