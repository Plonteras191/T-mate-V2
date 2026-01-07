// Authentication service for Supabase
import { supabase } from './supabase';
import type { User } from '../types/database.types';

export interface SignUpData {
    email: string;
    password: string;
    fullName: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User | null;
}

/**
 * Sign up a new user
 */
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    try {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName,
                },
            },
        });

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        // Check if email confirmation is required
        if (authData.user && !authData.user.confirmed_at) {
            return {
                success: true,
                message: 'Please check your email to verify your account.',
            };
        }

        return {
            success: true,
            message: 'Account created successfully!',
        };
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
};

/**
 * Sign in an existing user
 */
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
    try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            // Handle specific error cases
            if (error.message.includes('Email not confirmed')) {
                return {
                    success: false,
                    message: 'Please verify your email before signing in.',
                };
            }
            if (error.message.includes('Invalid login credentials')) {
                return {
                    success: false,
                    message: 'Invalid email or password.',
                };
            }
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Signed in successfully!',
        };
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Signed out successfully!',
        };
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'tmate://reset-password',
        });

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Password reset email sent. Please check your inbox.',
        };
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
};

/**
 * Resend email verification
 */
export const resendVerificationEmail = async (email: string): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Verification email sent. Please check your inbox.',
        };
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
};

/**
 * Get current user profile from database
 */
export const getCurrentUserProfile = async (): Promise<User | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getCurrentUserProfile:', error);
        return null;
    }
};
