import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseService } from '../services/supabase.service';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

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
