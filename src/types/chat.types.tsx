// Chat type definitions
import type { User } from './database.types';

// Message type enum
export type MessageType = 'text' | 'image' | 'file' | 'system';

// Message formatting options
export interface MessageFormatting {
    bold?: { start: number; end: number }[];
    italic?: { start: number; end: number }[];
    strikethrough?: { start: number; end: number }[];
    mentions?: { userId: string; username: string; start: number; end: number }[];
    links?: { url: string; start: number; end: number }[];
}

// Base message interface
export interface Message {
    id: string;
    group_id: string;
    sender_id: string;
    message_text: string | null;
    message_type: MessageType;
    formatting: MessageFormatting | null;
    created_at: string;
}

// User profile for sender
export interface UserProfile {
    id: string;
    full_name: string;
    profile_photo_url: string | null;
}

// Message with sender profile info
export interface MessageWithSender extends Message {
    sender: UserProfile;
    attachments?: MessageAttachment[];
}

// Grouped messages by date
export interface GroupedMessages {
    date: string;
    messages: MessageWithSender[];
}

// Message attachment interface
export interface MessageAttachment {
    id: string;
    message_id: string;
    attachment_type: AttachmentType;
    file_url: string;
    file_name: string;
    file_size: number;
    thumbnail_url: string | null;
    created_at: string;
}

export type AttachmentType = 'image' | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'txt';

// Input types
export interface SendMessageInput {
    group_id: string;
    message_text: string;
    message_type?: MessageType;
    formatting?: MessageFormatting;
}

// Chat state interface
export interface ChatState {
    messages: MessageWithSender[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    error: string | null;
}

// Pagination params
export interface MessagePaginationParams {
    groupId: string;
    limit?: number;
    before?: string; // cursor - message id or timestamp
}

// Realtime subscription types
export interface RealtimeMessagePayload {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    new: Message | null;
    old: Message | null;
}

// Chat input state
export interface ChatInputState {
    text: string;
    isSubmitting: boolean;
    replyTo?: MessageWithSender;
}
