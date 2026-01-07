// MessageList Component
import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MessageItem } from './MessageItem';
import { DateSeparator } from './DateSeparator';
import type { MessageWithSender } from '../../types/chat.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import {
    isConsecutiveMessage,
    shouldShowDateSeparator,
} from '../../utils/chatUtils';

interface MessageListProps {
    messages: MessageWithSender[];
    currentUserId: string;
    onLoadMore: () => void;
    loadingMore: boolean;
    hasMore: boolean;
    onAvatarPress?: (userId: string) => void;
    onMessageLongPress?: (message: MessageWithSender) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    onLoadMore,
    loadingMore,
    hasMore,
    onAvatarPress,
    onMessageLongPress,
}) => {
    const flatListRef = useRef<FlatList>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages.length]);

    const renderItem = ({ item, index }: { item: MessageWithSender; index: number }) => {
        const isOwnMessage = item.sender_id === currentUserId;
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        const isFirstInGroup =
            !previousMessage || !isConsecutiveMessage(item, previousMessage);
        const isLastInGroup = !nextMessage || !isConsecutiveMessage(nextMessage, item);
        const showDateSeparator = shouldShowDateSeparator(item, previousMessage);

        return (
            <>
                {showDateSeparator && <DateSeparator date={item.created_at} />}
                <MessageItem
                    message={item}
                    isOwnMessage={isOwnMessage}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                    onAvatarPress={() => onAvatarPress?.(item.sender_id)}
                    onLongPress={() => onMessageLongPress?.(item)}
                />
            </>
        );
    };

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={colors.primary.main} />
            </View>
        );
    };

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainer}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
                if (hasMore && !loadingMore) {
                    onLoadMore();
                }
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            maintainVisibleContentPosition={{
                minIndexForVisible: 0,
            }}
        />
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: spacing[2],
        flexGrow: 1,
    },
    loadingFooter: {
        paddingVertical: spacing[4],
        alignItems: 'center',
    },
});
