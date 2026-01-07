// Storage Service - File upload operations
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from './supabase';

export interface UploadResponse {
    success: boolean;
    message: string;
    url?: string;
}

/**
 * Compress image before upload
 */
export const compressImage = async (
    imageUri: string,
    quality: number = 0.7
): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 800 } }],
            {
                compress: quality,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result.uri;
    } catch (error) {
        console.error('Error compressing image:', error);
        return imageUri; // Return original if compression fails
    }
};

/**
 * Upload profile image to storage
 */
export const uploadProfileImage = async (
    userId: string,
    imageUri: string
): Promise<UploadResponse> => {
    try {
        // Compress image first
        const compressedUri = await compressImage(imageUri);

        // Generate unique filename
        const fileName = `${userId}/${Date.now()}.jpg`;

        // Read file and convert to ArrayBuffer (works better in React Native)
        const response = await fetch(compressedUri);
        const arraybuffer = await response.arrayBuffer();

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, arraybuffer, {
                contentType: 'image/jpeg',
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

        return {
            success: true,
            message: 'Image uploaded successfully',
            url: urlData.publicUrl,
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            success: false,
            message: 'Failed to upload image',
        };
    }
};

/**
 * Delete profile image from storage
 */
export const deleteProfileImage = async (
    userId: string,
    fileName: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
            .from('profile-photos')
            .remove([filePath]);

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Image deleted successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete image',
        };
    }
};

/**
 * Get public URL for a file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * Upload chat image
 */
export const uploadChatImage = async (
    groupId: string,
    userId: string,
    imageUri: string
): Promise<UploadResponse> => {
    try {
        const compressedUri = await compressImage(imageUri);
        const fileName = `${groupId}/${userId}/${Date.now()}.jpg`;

        // Read file and convert to ArrayBuffer (works better in React Native)
        const response = await fetch(compressedUri);
        const arraybuffer = await response.arrayBuffer();

        const { error: uploadError } = await supabase.storage
            .from('chat-images')
            .upload(fileName, arraybuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (uploadError) {
            return {
                success: false,
                message: uploadError.message,
            };
        }

        const { data: urlData } = supabase.storage
            .from('chat-images')
            .getPublicUrl(fileName);

        return {
            success: true,
            message: 'Image uploaded successfully',
            url: urlData.publicUrl,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to upload image',
        };
    }
};
