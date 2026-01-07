// Profile Service - CRUD operations for user profiles
import { supabase } from './supabase';
import type { User } from '../types/database.types';

export interface UpdateProfileInput {
    full_name?: string;
    bio?: string;
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    data?: User | null;
}

/**
 * Get profile by user ID
 */
export const getProfile = async (userId: string): Promise<User | null> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data as User;
    } catch (error) {
        console.error('Error in getProfile:', error);
        return null;
    }
};

/**
 * Get current authenticated user's profile
 */
export const getCurrentUserProfile = async (): Promise<User | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        return await getProfile(user.id);
    } catch (error) {
        console.error('Error in getCurrentUserProfile:', error);
        return null;
    }
};

/**
 * Update profile information
 */
export const updateProfile = async (data: UpdateProfileInput): Promise<ProfileResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        const { data: updatedProfile, error } = await supabase
            .from('users')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile as User,
        };
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred',
        };
    }
};

/**
 * Upload profile photo to storage and update profile
 */
export const uploadProfilePhoto = async (imageUri: string): Promise<ProfileResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        // Generate unique filename
        const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Read file and convert to ArrayBuffer (works better in React Native)
        const response = await fetch(imageUri);
        const arraybuffer = await response.arrayBuffer();

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, arraybuffer, {
                contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
                upsert: true,
            });

        if (uploadError) {
            return {
                success: false,
                message: uploadError.message,
            };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName);

        // Update profile with new photo URL
        const { data: updatedProfile, error: updateError } = await supabase
            .from('users')
            .update({
                profile_photo_url: urlData.publicUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            return {
                success: false,
                message: updateError.message,
            };
        }

        return {
            success: true,
            message: 'Profile photo updated successfully',
            data: updatedProfile as User,
        };
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        return {
            success: false,
            message: 'Failed to upload photo',
        };
    }
};

/**
 * Delete current profile photo
 */
export const deleteProfilePhoto = async (): Promise<ProfileResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        // Get current profile to find photo URL
        const profile = await getProfile(user.id);

        if (profile?.profile_photo_url) {
            // Extract file path from URL
            const urlParts = profile.profile_photo_url.split('/profile-photos/');
            if (urlParts[1]) {
                await supabase.storage
                    .from('profile-photos')
                    .remove([urlParts[1]]);
            }
        }

        // Update profile to remove photo URL
        const { data: updatedProfile, error } = await supabase
            .from('users')
            .update({
                profile_photo_url: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Profile photo removed',
            data: updatedProfile as User,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete photo',
        };
    }
};

/**
 * Update profile photo (delete old, upload new)
 */
export const updateProfilePhoto = async (imageUri: string): Promise<ProfileResponse> => {
    // Delete existing photo first (ignore errors)
    await deleteProfilePhoto();

    // Upload new photo
    return await uploadProfilePhoto(imageUri);
};
