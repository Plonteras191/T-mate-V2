// useFilePicker Hook - Document selection
import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import type { LocalFile, FilePickerResult } from '../types/attachment.types';

interface UseFilePickerReturn {
    pickFile: () => Promise<FilePickerResult>;
}

export const useFilePicker = (): UseFilePickerReturn => {
    const pickFile = useCallback(async (): Promise<FilePickerResult> => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/plain',
                ],
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                return { cancelled: true };
            }

            const asset = result.assets[0];
            const file: LocalFile = {
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType as any,
                size: asset.size || 0,
            };

            return { cancelled: false, file };
        } catch (error) {
            console.error('Error picking file:', error);
            return { cancelled: true };
        }
    }, []);

    return {
        pickFile,
    };
};
