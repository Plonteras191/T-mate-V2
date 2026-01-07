// Chat Service - Message CRUD and Realtime
import { supabase } from './supabase';
import type {
    Message,
    MessageWithSender,
    SendMessageInput,
    MessagePaginationParams,
    UserProfile,
} from '../types/chat.types';

const DEFAULT_PAGE_SIZE = 50;

/**
 * Get messages for a group with pagination
 */
export const getMessages = async ({
    groupId,
    limit = DEFAULT_PAGE_SIZE,
    before,
}: MessagePaginationParams): Promise<{
    messages: MessageWithSender[];
    hasMore: boolean;
}> => {
    try {
        let query = supabase
            .from('messages')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: false })
            .limit(limit + 1); // Fetch one extra to check hasMore

        if (before) {
            query = query.lt('created_at', before);
        }

        const { data, error } = await query;

        if (error) throw error;

        const hasMore = (data?.length || 0) > limit;
        const messages = hasMore ? data.slice(0, -1) : data;

        // Fetch sender info for each message
        const messagesWithSenders = await Promise.all(
            (messages || []).map(async (message: any) => {
                const { data: senderData } = await supabase
                    .from('users')
                    .select('id, full_name, profile_photo_url')
                    .eq('id', message.sender_id)
                    .single();

                return {
                    ...message,
                    sender: senderData as UserProfile,
                } as MessageWithSender;
            })
        );

        return {
            messages: messagesWithSenders,
            hasMore,
        };
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { messages: [], hasMore: false };
    }
};

/**
 * Send a new message
 */
export const sendMessage = async (
    input: SendMessageInput
): Promise<MessageWithSender | null> => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('messages')
            .insert({
                group_id: input.group_id,
                sender_id: user.id,
                message_text: input.message_text,
                message_type: input.message_type || 'text',
                formatting: input.formatting || null,
            })
            .select('*')
            .single();

        if (error) throw error;

        // Get sender info
        const { data: senderData } = await supabase
            .from('users')
            .select('id, full_name, profile_photo_url')
            .eq('id', user.id)
            .single();

        return {
            ...(data as any),
            sender: senderData as UserProfile,
        } as MessageWithSender;
    } catch (error) {
        console.error('Error sending message:', error);
        return null;
    }
};

/**
 * Get a single message by ID with sender info
 */
export const getMessageById = async (
    messageId: string
): Promise<MessageWithSender | null> => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', messageId)
            .single();

        if (error) throw error;

        // Get sender info
        const { data: senderData } = await supabase
            .from('users')
            .select('id, full_name, profile_photo_url')
            .eq('id', (data as any).sender_id)
            .single();

        return {
            ...(data as any),
            sender: senderData as UserProfile,
        } as MessageWithSender;
    } catch (error) {
        console.error('Error fetching message:', error);
        return null;
    }
};

/**
 * Subscribe to new messages in a group
 */
export const subscribeToMessages = (
    groupId: string,
    callback: (message: MessageWithSender) => void
): (() => void) => {
    const channel = supabase
        .channel(`messages:${groupId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `group_id=eq.${groupId}`,
            },
            async (payload) => {
                // Fetch the full message with sender info
                const message = await getMessageById(payload.new.id);
                if (message) {
                    callback(message);
                }
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

/**
 * Get latest messages for initial load
 */
export const getLatestMessages = async (
    groupId: string,
    limit: number = DEFAULT_PAGE_SIZE
): Promise<MessageWithSender[]> => {
    const { messages } = await getMessages({ groupId, limit });
    return messages;
};

/**
 * Load more messages before a timestamp
 */
export const loadMoreMessages = async (
    groupId: string,
    beforeTimestamp: string,
    limit: number = DEFAULT_PAGE_SIZE
): Promise<{
    messages: MessageWithSender[];
    hasMore: boolean;
}> => {
    return getMessages({ groupId, limit, before: beforeTimestamp });
};

/**
 * Get total message count for a group
 */
export const getMessageCount = async (groupId: string): Promise<number> => {
    const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

    return count || 0;
};
