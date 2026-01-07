// Attachment Service - Upload/download/manage attachments
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import type {
    LocalFile,
    LocalImage,
    UploadResult,
    UploadedAttachment,
    AttachmentType,
} from '../types/attachment.types';
import { getAttachmentType } from '../utils/fileUtils';

/**
 * Upload image to chat-images bucket with compression
 */
export const uploadImage = async (
    groupId: string,
    image: LocalImage
): Promise<UploadResult> => {
    try {
        // Compress image
        const compressed = await ImageManipulator.manipulateAsync(
            image.uri,
            [{ resize: { width: 1200 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 8);
        const fileName = `${groupId}/${timestamp}_${random}.jpg`;

        // Read file and convert to ArrayBuffer (works better in React Native)
        const response = await fetch(compressed.uri);
        const arraybuffer = await response.arrayBuffer();

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from('chat-images')
            .upload(fileName, arraybuffer, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('chat-images').getPublicUrl(fileName);

        // Generate thumbnail
        const thumbnailBlob = await generateThumbnail(image.uri);
        const thumbnailFileName = `${groupId}/thumb_${timestamp}_${random}.jpg`;

        const { error: thumbError } = await supabase.storage
            .from('chat-images')
            .upload(thumbnailFileName, thumbnailBlob, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        let thumbnailUrl: string | undefined;
        if (!thumbError) {
            const { data: thumbData } = supabase.storage
                .from('chat-images')
                .getPublicUrl(thumbnailFileName);
            thumbnailUrl = thumbData.publicUrl;
        }

        return {
            success: true,
            url: publicUrl,
            thumbnailUrl,
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
};

/**
 * Upload file to chat-files bucket
 */
export const uploadFile = async (
    groupId: string,
    file: LocalFile
): Promise<UploadResult> => {
    try {
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('File size exceeds 10MB limit');
        }

        const timestamp = Date.now();
        const random = Math.random().toString(36).slice(2, 8);
        const fileName = `${groupId}/${timestamp}_${file.name}`;

        // Read file and convert to ArrayBuffer (works better in React Native)
        const response = await fetch(file.uri);
        const arraybuffer = await response.arrayBuffer();

        // Upload
        const { data, error } = await supabase.storage
            .from('chat-files')
            .upload(fileName, arraybuffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) throw error;

        const {
            data: { publicUrl },
        } = supabase.storage.from('chat-files').getPublicUrl(fileName);

        return {
            success: true,
            url: publicUrl,
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
};

/**
 * Download file to device with progress tracking
 */
export const downloadFile = async (
    fileUrl: string,
    fileName: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    try {
        const downloadDir = FileSystem.documentDirectory + 'downloads/';

        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(downloadDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
        }

        const localPath = downloadDir + fileName;

        const downloadResumable = FileSystem.createDownloadResumable(
            fileUrl,
            localPath,
            {},
            (downloadProgress) => {
                const progress =
                    downloadProgress.totalBytesWritten /
                    downloadProgress.totalBytesExpectedToWrite;
                onProgress?.(progress * 100);
            }
        );

        const result = await downloadResumable.downloadAsync();
        if (!result?.uri) throw new Error('Download failed');

        return result.uri;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

/**
 * Create attachment record in database
 */
export const createAttachmentRecord = async (
    messageId: string,
    attachmentType: AttachmentType,
    fileUrl: string,
    fileName: string,
    fileSize: number,
    thumbnailUrl?: string
): Promise<UploadedAttachment | null> => {
    try {
        const { data, error } = await supabase
            .from('message_attachments')
            .insert({
                message_id: messageId,
                attachment_type: attachmentType,
                file_url: fileUrl,
                file_name: fileName,
                file_size: fileSize,
                thumbnail_url: thumbnailUrl || null,
            })
            .select()
            .single();

        if (error) throw error;
        return data as UploadedAttachment;
    } catch (error) {
        console.error('Error creating attachment record:', error);
        return null;
    }
};

/**
 * Get attachments for a message
 */
export const getAttachmentsForMessage = async (
    messageId: string
): Promise<UploadedAttachment[]> => {
    try {
        const { data, error } = await supabase
            .from('message_attachments')
            .select('*')
            .eq('message_id', messageId);

        if (error) throw error;
        return (data as UploadedAttachment[]) || [];
    } catch (error) {
        console.error('Error fetching attachments:', error);
        return [];
    }
};

/**
 * Generate thumbnail from image
 */
const generateThumbnail = async (imageUri: string): Promise<ArrayBuffer> => {
    const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 200 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );

    const response = await fetch(result.uri);
    const arraybuffer = await response.arrayBuffer();

    return arraybuffer;
};



/**
 * Validate file before upload
 */
export const validateFile = (
    file: LocalFile
): { valid: boolean; error?: string } => {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check file type
    const validTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
    ];

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'File type not supported' };
    }

    return { valid: true };
};
