// File utility functions
import type { AttachmentType, AttachmentMimeType, FileExtension } from '../types/attachment.types';

// MIME type to attachment type mapping
const MIME_TO_TYPE: Record<string, AttachmentType> = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/webp': 'image',
    'image/gif': 'image',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
};

// Extension to MIME type mapping
const EXT_TO_MIME: Record<FileExtension, AttachmentMimeType> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain',
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (fileName: string): string => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Get attachment type from MIME type
 */
export const getAttachmentType = (mimeType: string): AttachmentType => {
    return MIME_TO_TYPE[mimeType] || 'txt';
};

/**
 * Check if MIME type is an image
 */
export const isImageType = (type: string): boolean => {
    return type.startsWith('image/');
};

/**
 * Check if MIME type is a document
 */
export const isDocumentType = (type: string): boolean => {
    return (
        type.startsWith('application/') ||
        type === 'text/plain'
    );
};

/**
 * Validate file size against limits
 */
export const validateFileSize = (
    size: number,
    type: 'image' | 'document'
): boolean => {
    const limit = type === 'image' ? 10 * 1024 * 1024 : 10 * 1024 * 1024; // 10MB
    return size <= limit;
};

/**
 * Validate file type is allowed
 */
export const validateFileType = (mimeType: string): boolean => {
    return mimeType in MIME_TO_TYPE;
};

/**
 * Generate unique filename with timestamp
 */
export const generateUniqueFileName = (originalName: string): string => {
    const ext = getFileExtension(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    return `${timestamp}_${random}.${ext}`;
};

/**
 * Get MIME type from file extension
 */
export const getMimeType = (extension: string): AttachmentMimeType | null => {
    const ext = extension.toLowerCase() as FileExtension;
    return EXT_TO_MIME[ext] || null;
};

/**
 * Get file icon emoji based on type
 */
export const getFileIcon = (type: AttachmentType): string => {
    const icons: Record<AttachmentType, string> = {
        image: '🖼️',
        pdf: '📕',
        doc: '📘',
        docx: '📘',
        ppt: '📙',
        pptx: '📙',
        xls: '📗',
        xlsx: '📗',
        txt: '📄',
    };
    return icons[type] || '📄';
};

/**
 * Get file type color
 */
export const getFileTypeColor = (type: AttachmentType): string => {
    const colors: Record<AttachmentType, string> = {
        image: '#8B5CF6', // Purple
        pdf: '#EF4444', // Red
        doc: '#3B82F6', // Blue
        docx: '#3B82F6',
        ppt: '#F97316', // Orange
        pptx: '#F97316',
        xls: '#10B981', // Green
        xlsx: '#10B981',
        txt: '#6B7280', // Gray
    };
    return colors[type] || '#6B7280';
};
