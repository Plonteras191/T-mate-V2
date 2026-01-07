// useImagePicker Hook - Image selection and camera
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import type { LocalImage, ImagePickerResult } from '../types/attachment.types';

interface UseImagePickerReturn {
    pickImage: () => Promise<ImagePickerResult>;
    takePhoto: () => Promise<ImagePickerResult>;
    requestPermissions: () => Promise<boolean>;
    hasPermission: boolean;
}

export const useImagePicker = (): UseImagePickerReturn => {
    const [hasPermission, setHasPermission] = useState(false);

    const requestPermissions = useCallback(async (): Promise<boolean> => {
        try {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            const mediaPermission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            const granted =
                cameraPermission.status === 'granted' &&
                mediaPermission.status === 'granted';

            setHasPermission(granted);
            return granted;
        } catch (error) {
            console.error('Error requesting permissions:', error);
            return false;
        }
    }, []);

    const pickImage = useCallback(async (): Promise<ImagePickerResult> => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 0.8,
                allowsEditing: false,
            });

            if (result.canceled) {
                return { cancelled: true };
            }

            const images: LocalImage[] = result.assets.map((asset) => ({
                uri: asset.uri,
                name: asset.fileName || `image_${Date.now()}.jpg`,
                type: 'image/jpeg',
                size: asset.fileSize || 0,
                width: asset.width,
                height: asset.height,
            }));

            return { cancelled: false, images };
        } catch (error) {
            console.error('Error picking image:', error);
            return { cancelled: true };
        }
    }, []);

    const takePhoto = useCallback(async (): Promise<ImagePickerResult> => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: 'images',
                quality: 0.8,
                allowsEditing: false,
            });

            if (result.canceled) {
                return { cancelled: true };
            }

            const asset = result.assets[0];
            const image: LocalImage = {
                uri: asset.uri,
                name: asset.fileName || `photo_${Date.now()}.jpg`,
                type: 'image/jpeg',
                size: asset.fileSize || 0,
                width: asset.width,
                height: asset.height,
            };

            return { cancelled: false, images: [image] };
        } catch (error) {
            console.error('Error taking photo:', error);
            return { cancelled: true };
        }
    }, []);

    return {
        pickImage,
        takePhoto,
        requestPermissions,
        hasPermission,
    };
};
