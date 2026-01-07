// useProfile Hook
import { useState, useEffect, useCallback } from 'react';
import * as profileService from '../services/profile.service';
import type { User } from '../types/database.types';

interface UseProfileReturn {
    profile: User | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateProfile: (data: profileService.UpdateProfileInput) => Promise<boolean>;
    uploadPhoto: (uri: string) => Promise<boolean>;
    deletePhoto: () => Promise<boolean>;
}

export const useProfile = (): UseProfileReturn => {
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await profileService.getCurrentUserProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(async (data: profileService.UpdateProfileInput): Promise<boolean> => {
        const result = await profileService.updateProfile(data);
        if (result.success && result.data) {
            setProfile(result.data);
        }
        return result.success;
    }, []);

    const uploadPhoto = useCallback(async (uri: string): Promise<boolean> => {
        setLoading(true);
        const result = await profileService.updateProfilePhoto(uri);
        setLoading(false);
        if (result.success && result.data) {
            setProfile(result.data);
        }
        return result.success;
    }, []);

    const deletePhoto = useCallback(async (): Promise<boolean> => {
        const result = await profileService.deleteProfilePhoto();
        if (result.success && result.data) {
            setProfile(result.data);
        }
        return result.success;
    }, []);

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
        updateProfile,
        uploadPhoto,
        deletePhoto,
    };
};
