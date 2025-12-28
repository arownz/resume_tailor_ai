import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabase.service';
import type { User } from '@supabase/supabase-js';

const GUEST_ANALYSIS_LIMIT = 3;
const GUEST_USAGE_KEY = 'resume_tailor_guest_usage';

interface GuestUsage {
    count: number;
    lastReset: string; // ISO date string
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    guestUsageCount: number;
    guestUsageLimit: number;
    canAnalyze: boolean;
    incrementGuestUsage: () => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Helper to get guest usage from localStorage
const getGuestUsage = (): GuestUsage => {
    try {
        const stored = localStorage.getItem(GUEST_USAGE_KEY);
        if (stored) {
            const usage = JSON.parse(stored) as GuestUsage;
            // Reset count if it's a new day
            const today = new Date().toISOString().split('T')[0];
            if (usage.lastReset !== today) {
                return { count: 0, lastReset: today };
            }
            return usage;
        }
    } catch (e) {
        console.error('Error reading guest usage:', e);
    }
    return { count: 0, lastReset: new Date().toISOString().split('T')[0] };
};

// Helper to save guest usage to localStorage
const saveGuestUsage = (usage: GuestUsage) => {
    try {
        localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify(usage));
    } catch (e) {
        console.error('Error saving guest usage:', e);
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [guestUsageCount, setGuestUsageCount] = useState(0);

    // Initialize guest usage on mount
    useEffect(() => {
        const usage = getGuestUsage();
        setGuestUsageCount(usage.count);
    }, []);

    // Check if user can analyze (logged in OR under guest limit)
    const canAnalyze = user !== null || guestUsageCount < GUEST_ANALYSIS_LIMIT;

    const incrementGuestUsage = () => {
        if (!user) {
            const usage = getGuestUsage();
            const newUsage = { ...usage, count: usage.count + 1 };
            saveGuestUsage(newUsage);
            setGuestUsageCount(newUsage.count);
        }
    };

    const refreshUser = async () => {
        try {
            const currentUser = await SupabaseService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        // Check initial auth state
        const checkUser = async () => {
            try {
                const currentUser = await SupabaseService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error checking user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkUser();

        // Subscribe to auth changes
        const client = SupabaseService.getClient();
        if (!client) {
            setLoading(false);
            return;
        }

        const { data: authListener } = client.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const data = await SupabaseService.signIn(email, password);
            setUser(data.user);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        try {
            const data = await SupabaseService.signUp(email, password);
            setUser(data.user ?? null);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGitHub = async () => {
        await SupabaseService.signInWithProvider('github');
        // User will be set via onAuthStateChange after redirect
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await SupabaseService.signOut();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                guestUsageCount,
                guestUsageLimit: GUEST_ANALYSIS_LIMIT,
                canAnalyze,
                incrementGuestUsage,
                signIn,
                signUp,
                signInWithGitHub,
                signOut,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
