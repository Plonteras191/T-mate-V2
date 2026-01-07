// Authentication Context for global auth state management
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import * as authService from '../services/auth.service';
import type { User } from '../types/database.types';

interface AuthContextType {
    // State
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Auth methods
    signUp: (data: authService.SignUpData) => Promise<authService.AuthResponse>;
    signIn: (data: authService.SignInData) => Promise<authService.AuthResponse>;
    signOut: () => Promise<authService.AuthResponse>;
    resetPassword: (email: string) => Promise<authService.AuthResponse>;
    resendVerificationEmail: (email: string) => Promise<authService.AuthResponse>;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile from database
    const fetchUserProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return data as User;
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            return null;
        }
    }, []);

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get current session
                const { data: { session: currentSession } } = await supabase.auth.getSession();

                if (currentSession?.user) {
                    setSession(currentSession);
                    const profile = await fetchUserProfile(currentSession.user.id);
                    setUser(profile);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                console.log('Auth state changed:', event);

                setSession(newSession);

                if (newSession?.user) {
                    const profile = await fetchUserProfile(newSession.user.id);
                    setUser(profile);
                } else {
                    setUser(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchUserProfile]);

    // Refresh user profile
    const refreshUser = useCallback(async () => {
        if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
        }
    }, [session, fetchUserProfile]);

    // Auth methods
    const signUp = useCallback(async (data: authService.SignUpData) => {
        setIsLoading(true);
        const result = await authService.signUp(data);
        setIsLoading(false);
        return result;
    }, []);

    const signIn = useCallback(async (data: authService.SignInData) => {
        setIsLoading(true);
        const result = await authService.signIn(data);
        setIsLoading(false);
        return result;
    }, []);

    const signOut = useCallback(async () => {
        setIsLoading(true);
        const result = await authService.signOut();
        if (result.success) {
            setUser(null);
            setSession(null);
        }
        setIsLoading(false);
        return result;
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        return await authService.resetPassword(email);
    }, []);

    const resendVerificationEmail = useCallback(async (email: string) => {
        return await authService.resendVerificationEmail(email);
    }, []);

    const value: AuthContextType = {
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signUp,
        signIn,
        signOut,
        resetPassword,
        resendVerificationEmail,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
