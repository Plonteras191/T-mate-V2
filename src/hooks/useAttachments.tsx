// useAttachments Hook - Manage pending attachments state
import { useState, useCallback } from 'react';
import type {
    PendingAttachment,
    LocalFile,
    LocalImage,
    UploadedAttachment,
} from '../types/attachment.types';
import * as attachmentService from '../services/attachment.service';
import { getAttachmentType, isImageType } from '../utils/fileUtils';

interface UseAttachmentsReturn {
    pendingAttachments: PendingAttachment[];
    addImage: (image: LocalImage) => void;
    addFile: (file: LocalFile) => void;
    removeAttachment: (id: string) => void;
    clearAttachments: () => void;
    uploadAll: (groupId: string) => Promise<UploadedAttachment[]>;
    isUploading: boolean;
    totalProgress: number;
}

export const useAttachments = (): UseAttachmentsReturn => {
    const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>(
        []
    );
    const [isUploading, setIsUploading] = useState(false);
    const [totalProgress, setTotalProgress] = useState(0);

    const addImage = useCallback((image: LocalImage) => {
        const newAttachment: PendingAttachment = {
            id: `temp-${Date.now()}-${Math.random()}`,
            localFile: image,
            uploadProgress: 0,
            status: 'pending',
        };

        setPendingAttachments((prev) => [...prev, newAttachment]);
    }, []);

    const addFile = useCallback((file: LocalFile) => {
        // Validate file
        const validation = attachmentService.validateFile(file);
        if (!validation.valid) {
            console.error('File validation failed:', validation.error);
            return;
        }

        const newAttachment: PendingAttachment = {
            id: `temp-${Date.now()}-${Math.random()}`,
            localFile: file,
            uploadProgress: 0,
            status: 'pending',
        };

        setPendingAttachments((prev) => [...prev, newAttachment]);
    }, []);

    const removeAttachment = useCallback((id: string) => {
        setPendingAttachments((prev) => prev.filter((att) => att.id !== id));
    }, []);

    const clearAttachments = useCallback(() => {
        setPendingAttachments([]);
        setTotalProgress(0);
    }, []);

    const uploadAll = useCallback(
        async (groupId: string): Promise<UploadedAttachment[]> => {
            if (pendingAttachments.length === 0) return [];

            setIsUploading(true);
            const uploadedAttachments: UploadedAttachment[] = [];

            try {
                for (let i = 0; i < pendingAttachments.length; i++) {
                    const pending = pendingAttachments[i];

                    // Update status to uploading
                    setPendingAttachments((prev) =>
                        prev.map((att) =>
                            att.id === pending.id ? { ...att, status: 'uploading' } : att
                        )
                    );

                    let uploadResult;

                    if (isImageType(pending.localFile.type)) {
                        uploadResult = await attachmentService.uploadImage(
                            groupId,
                            pending.localFile as LocalImage
                        );
                    } else {
                        uploadResult = await attachmentService.uploadFile(
                            groupId,
                            pending.localFile
                        );
                    }

                    if (uploadResult.success && uploadResult.url) {
                        // Update status to success
                        setPendingAttachments((prev) =>
                            prev.map((att) =>
                                att.id === pending.id ? { ...att, status: 'success', uploadProgress: 100 } : att
                            )
                        );

                        // Note: Attachment record will be created after message is created
                        // This just returns the URLs for now
                        const uploaded: any = {
                            file_url: uploadResult.url,
                            thumbnail_url: uploadResult.thumbnailUrl || null,
                            file_name: pending.localFile.name,
                            file_size: pending.localFile.size,
                            attachment_type: getAttachmentType(pending.localFile.type),
                        };

                        uploadedAttachments.push(uploaded);
                    } else {
                        // Update status to error
                        setPendingAttachments((prev) =>
                            prev.map((att) =>
                                att.id === pending.id
                                    ? { ...att, status: 'error', error: uploadResult.error }
                                    : att
                            )
                        );
                    }

                    // Update total progress
                    const progress = ((i + 1) / pendingAttachments.length) * 100;
                    setTotalProgress(progress);
                }
            } catch (error) {
                console.error('Error uploading attachments:', error);
            } finally {
                setIsUploading(false);
            }

            return uploadedAttachments;
        },
        [pendingAttachments]
    );

    return {
        pendingAttachments,
        addImage,
        addFile,
        removeAttachment,
        clearAttachments,
        uploadAll,
        isUploading,
        totalProgress,
    };
};
