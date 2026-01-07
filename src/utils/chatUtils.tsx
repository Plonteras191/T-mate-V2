// Chat utility functions
import type {
    Message,
    MessageWithSender,
    GroupedMessages,
    MessageFormatting,
    UserProfile,
} from '../types/chat.types';
import { formatDate, formatTime } from './formatters';

/**
 * Group messages by date for date separators
 */
export const groupMessagesByDate = (
    messages: MessageWithSender[]
): GroupedMessages[] => {
    const grouped: Record<string, MessageWithSender[]> = {};

    messages.forEach((message) => {
        const date = new Date(message.created_at).toDateString();
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(message);
    });

    return Object.entries(grouped).map(([date, msgs]) => ({
        date,
        messages: msgs,
    }));
};

/**
 * Format message time to "2:30 PM" format
 */
export const formatMessageTime = (timestamp: string): string => {
    return formatTime(timestamp);
};

/**
 * Format message date to "Today", "Yesterday", or "Jan 7, 2026"
 */
export const formatMessageDate = (timestamp: string): string => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for comparison
    const messageDay = new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate()
    );
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDay = new Date(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate()
    );

    if (messageDay.getTime() === todayDay.getTime()) {
        return 'Today';
    } else if (messageDay.getTime() === yesterdayDay.getTime()) {
        return 'Yesterday';
    } else {
        return formatDate(timestamp);
    }
};

/**
 * Check if messages are consecutive (same sender, within 2 minutes)
 */
export const isConsecutiveMessage = (
    current: Message,
    previous: Message | null
): boolean => {
    if (!previous) return false;
    if (current.sender_id !== previous.sender_id) return false;

    const currentTime = new Date(current.created_at).getTime();
    const previousTime = new Date(previous.created_at).getTime();
    const timeDiff = currentTime - previousTime;

    return timeDiff < 2 * 60 * 1000; // 2 minutes
};

/**
 * Check if date separator should be shown between messages
 */
export const shouldShowDateSeparator = (
    current: Message,
    previous: Message | null
): boolean => {
    if (!previous) return true;

    const currentDate = new Date(current.created_at).toDateString();
    const previousDate = new Date(previous.created_at).toDateString();

    return currentDate !== previousDate;
};

/**
 * Parse message formatting (basic implementation)
 */
export const parseMessageFormatting = (
    text: string,
    formatting: MessageFormatting | null
): string => {
    // For now, just return the text
    // Can be extended to apply formatting in React components
    return text;
};

/**
 * Extract @mentions from text
 */
export const extractMentions = (
    text: string
): { userId: string; username: string; start: number; end: number }[] => {
    const mentions: { userId: string; username: string; start: number; end: number }[] = [];
    const mentionRegex = /@(\w+)/g;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push({
            userId: '', // Would need to resolve username to userId
            username: match[1],
            start: match.index,
            end: match.index + match[0].length,
        });
    }

    return mentions;
};

/**
 * Extract URLs from text
 */
export const extractLinks = (
    text: string
): { url: string; start: number; end: number }[] => {
    const links: { url: string; start: number; end: number }[] = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        links.push({
            url: match[1],
            start: match.index,
            end: match.index + match[0].length,
        });
    }

    return links;
};

/**
 * Generate optimistic message for UI
 */
export const generateOptimisticMessage = (
    text: string,
    groupId: string,
    sender: UserProfile
): MessageWithSender => {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    return {
        id: tempId,
        group_id: groupId,
        sender_id: sender.id,
        message_text: text,
        message_type: 'text',
        formatting: null,
        created_at: new Date().toISOString(),
        sender,
        attachments: [],
    };
};

/**
 * Truncate message for preview
 */
export const truncateMessagePreview = (
    text: string,
    maxLength: number = 50
): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};
