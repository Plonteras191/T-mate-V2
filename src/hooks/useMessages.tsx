// useMessages Hook - Message fetching and grouping
import { useState, useEffect, useCallback } from 'react';
import * as chatService from '../services/chat.service';
import { groupMessagesByDate } from '../utils/chatUtils';
import type { MessageWithSender, GroupedMessages } from '../types/chat.types';

interface UseMessagesReturn {
    messages: MessageWithSender[];
    groupedMessages: GroupedMessages[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useMessages = (groupId: string): UseMessagesReturn => {
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await chatService.getMessages({ groupId });
            setMessages(result.messages.reverse());
        } catch (err) {
            setError('Failed to fetch messages');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const groupedMessages = groupMessagesByDate(messages);

    return {
        messages,
        groupedMessages,
        loading,
        error,
        refetch: fetchMessages,
    };
};
