// Image utility functions
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface ImagePickerResult {
    success: boolean;
    uri?: string;
    cancelled?: boolean;
    error?: string;
}

/**
 * Pick image from gallery
 */
export const pickImage = async (): Promise<ImagePickerResult> => {
    try {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            return {
                success: false,
                error: 'Permission to access gallery was denied',
            };
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) {
            return {
                success: false,
                cancelled: true,
            };
        }

        return {
            success: true,
            uri: result.assets[0].uri,
        };
    } catch (error: any) {
        console.error('Error picking image:', error);
        return {
            success: false,
            error: error?.message || 'Failed to pick image',
        };
    }
};

/**
 * Take photo with camera
 */
export const takePhoto = async (): Promise<ImagePickerResult> => {
    try {
        // Request permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            return {
                success: false,
                error: 'Permission to access camera was denied',
            };
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) {
            return {
                success: false,
                cancelled: true,
            };
        }

        return {
            success: true,
            uri: result.assets[0].uri,
        };
    } catch (error) {
        console.error('Error taking photo:', error);
        return {
            success: false,
            error: 'Failed to take photo',
        };
    }
};

/**
 * Compress image to reduce file size
 */
export const compressImage = async (
    uri: string,
    quality: number = 0.7
): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            {
                compress: quality,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result.uri;
    } catch (error) {
        console.error('Error compressing image:', error);
        return uri;
    }
};

/**
 * Get image dimensions
 */
export const getImageSize = async (
    uri: string
): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
        const { Image } = require('react-native');
        Image.getSize(
            uri,
            (width: number, height: number) => resolve({ width, height }),
            () => resolve(null)
        );
    });
};

/**
 * Generate unique filename for upload
 */
export const generateFileName = (userId: string, extension: string = 'jpg'): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${userId}_${timestamp}_${random}.${extension}`;
};

/**
 * Show image picker with gallery and camera options
 */
export const showImagePickerOptions = async (
    onGallery: () => void,
    onCamera: () => void
): Promise<void> => {
    // This is a placeholder - actual implementation will use ActionSheet
    // For now, we'll just call gallery picker
    onGallery();
};
