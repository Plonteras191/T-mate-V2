// Attachment type definitions
export type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export type DocumentMimeType =
    | 'application/pdf'
    | 'application/msword'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'application/vnd.ms-powerpoint'
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'text/plain';

export type AttachmentMimeType = ImageMimeType | DocumentMimeType;

export type FileExtension =
    | 'jpg'
    | 'jpeg'
    | 'png'
    | 'webp'
    | 'gif'
    | 'pdf'
    | 'doc'
    | 'docx'
    | 'ppt'
    | 'pptx'
    | 'xls'
    | 'xlsx'
    | 'txt';

export type AttachmentType = 'image' | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'txt';

// Local file before upload
export interface LocalFile {
    uri: string;
    name: string;
    type: AttachmentMimeType;
    size: number;
}

// Image specific
export interface LocalImage extends LocalFile {
    width: number;
    height: number;
    base64?: string;
}

// Pending attachment (before upload)
export interface PendingAttachment {
    id: string; // temporary local ID
    localFile: LocalFile | LocalImage;
    caption?: string;
    uploadProgress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

// Uploaded attachment (from database)
export interface UploadedAttachment {
    id: string;
    message_id: string;
    attachment_type: AttachmentType;
    file_url: string;
    file_name: string;
    file_size: number;
    thumbnail_url: string | null;
    created_at: string;
}

// Upload result
export interface UploadResult {
    success: boolean;
    url?: string;
    thumbnailUrl?: string;
    error?: string;
}

// File picker result
export interface FilePickerResult {
    cancelled: boolean;
    file?: LocalFile;
}

// Image picker result
export interface ImagePickerResult {
    cancelled: boolean;
    images?: LocalImage[];
}

// Download state
export interface DownloadState {
    fileUrl: string;
    fileName: string;
    progress: number;
    status: 'idle' | 'downloading' | 'success' | 'error';
    localPath?: string;
    error?: string;
}

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
    image: 10 * 1024 * 1024, // 10MB
    document: 10 * 1024 * 1024, // 10MB
} as const;

// Allowed extensions
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;
export const ALLOWED_DOCUMENT_EXTENSIONS = [
    'pdf',
    'doc',
    'docx',
    'ppt',
    'pptx',
    'xls',
    'xlsx',
    'txt',
] as const;
