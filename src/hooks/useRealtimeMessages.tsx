// useRealtimeMessages Hook - Realtime subscription management
import { useState, useEffect, useRef } from 'react';
import * as chatService from '../services/chat.service';
import type { MessageWithSender } from '../types/chat.types';

interface UseRealtimeMessagesReturn {
    isConnected: boolean;
    lastMessage: MessageWithSender | null;
}

export const useRealtimeMessages = (
    groupId: string,
    onNewMessage?: (message: MessageWithSender) => void
): UseRealtimeMessagesReturn => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<MessageWithSender | null>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        setIsConnected(false);

        const unsubscribe = chatService.subscribeToMessages(groupId, (message) => {
            setLastMessage(message);
            setIsConnected(true);
            onNewMessage?.(message);
        });

        unsubscribeRef.current = unsubscribe;

        // Mark as connected after a short delay
        const timer = setTimeout(() => {
            setIsConnected(true);
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
            setIsConnected(false);
        };
    }, [groupId, onNewMessage]);

    return {
        isConnected,
        lastMessage,
    };
};
