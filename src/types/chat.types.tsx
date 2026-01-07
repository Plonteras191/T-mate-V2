// Chat type definitions
import type { User } from './database.types';

// Message type enum
export type MessageType = 'text' | 'image' | 'file' | 'system';

// Text range for formatting
export interface TextRange {
    start: number;
    end: number;
}

// Mention data
export interface MentionData {
    userId: string;
    username: string;
    start: number;
    end: number;
}

// Link data
export interface LinkData {
    url: string;
    start: number;
    end: number;
}

// Message formatting options
export interface MessageFormatting {
    bold?: TextRange[];
    italic?: TextRange[];
    strikethrough?: TextRange[];
    mentions?: MentionData[];
    links?: LinkData[];
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
    attachments: any[]; // Will be UploadedAttachment[] from attachment.types
}

// Grouped messages by date
export interface GroupedMessages {
    date: string;
    messages: MessageWithSender[];
}

// Input types
export interface SendMessageInput {
    group_id: string;
    message_text: string;
    message_type?: MessageType;
    formatting?: MessageFormatting;
}

// Send message with attachments
export interface SendMessageWithAttachmentsInput {
    group_id: string;
    message_text?: string;
    message_type: 'text' | 'image' | 'file';
    formatting?: MessageFormatting;
    attachments?: any[]; // Will be PendingAttachment[] from attachment.types
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
