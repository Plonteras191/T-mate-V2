// useChat Hook - Main chat functionality
import { useState, useEffect, useCallback, useRef } from 'react';
import * as chatService from '../services/chat.service';
import type { MessageWithSender } from '../types/chat.types';
import { useAuth } from './useAuth';

interface UseChatReturn {
    messages: MessageWithSender[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    error: string | null;
    sendMessage: (text: string) => Promise<boolean>;
    loadMoreMessages: () => Promise<void>;
    refreshMessages: () => Promise<void>;
}

export const useChat = (groupId: string): UseChatReturn => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // Load initial messages
    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await chatService.getMessages({ groupId });
            setMessages(result.messages.reverse()); // Reverse for chronological order
            setHasMore(result.hasMore);
        } catch (err) {
            setError('Failed to load messages');
            console.error('Error loading messages:', err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    // Load more messages (pagination)
    const loadMoreMessages = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const oldestMessage = messages[0];
            if (!oldestMessage) return;

            const result = await chatService.loadMoreMessages(
                groupId,
                oldestMessage.created_at
            );

            setMessages((prev) => [...result.messages.reverse(), ...prev]);
            setHasMore(result.hasMore);
        } catch (err) {
            console.error('Error loading more messages:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [groupId, messages, loadingMore, hasMore]);

    // Send message
    const sendMessage = useCallback(
        async (text: string): Promise<boolean> => {
            if (!text.trim()) return false;

            try {
                const message = await chatService.sendMessage({
                    group_id: groupId,
                    message_text: text.trim(),
                });

                if (!message) return false;

                // Message will be added via realtime subscription
                // But we can add optimistically for better UX
                return true;
            } catch (err) {
                console.error('Error sending message:', err);
                return false;
            }
        },
        [groupId]
    );

    // Refresh messages
    const refreshMessages = useCallback(async () => {
        await loadMessages();
    }, [loadMessages]);

    // Setup realtime subscription
    useEffect(() => {
        loadMessages();

        // Subscribe to new messages
        const unsubscribe = chatService.subscribeToMessages(
            groupId,
            (newMessage) => {
                setMessages((prev) => {
                    // Prevent duplicates
                    if (prev.some((m) => m.id === newMessage.id)) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
            }
        );

        unsubscribeRef.current = unsubscribe;

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [groupId, loadMessages]);

    return {
        messages,
        loading,
        loadingMore,
        hasMore,
        error,
        sendMessage,
        loadMoreMessages,
        refreshMessages,
    };
};
