// ChatBubble Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import type { MessageWithSender } from '../../types/chat.types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatMessageTime } from '../../utils/chatUtils';

interface ChatBubbleProps {
    message: MessageWithSender;
    isOwnMessage: boolean;
    showAvatar?: boolean;
    showName?: boolean;
    onAvatarPress?: () => void;
    onLongPress?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    message,
    isOwnMessage,
    showAvatar = true,
    showName = true,
    onAvatarPress,
    onLongPress,
}) => {
    const bubbleStyle = isOwnMessage ? styles.bubbleSent : styles.bubbleReceived;
    const textStyle = isOwnMessage ? styles.textSent : styles.textReceived;

    return (
        <View style={[styles.container, isOwnMessage && styles.containerOwn]}>
            {/* Avatar for others' messages */}
            {!isOwnMessage && showAvatar && (
                <TouchableOpacity onPress={onAvatarPress} style={styles.avatarContainer}>
                    <Avatar
                        uri={message.sender.profile_photo_url}
                        name={message.sender.full_name}
                        size="small"
                    />
                </TouchableOpacity>
            )}

            <View style={[styles.bubbleWrapper, isOwnMessage && styles.bubbleWrapperOwn]}>
                {/* Sender name */}
                {!isOwnMessage && showName && (
                    <Text style={styles.senderName}>{message.sender.full_name}</Text>
                )}

                {/* Message bubble */}
                <TouchableOpacity
                    onLongPress={onLongPress}
                    activeOpacity={0.8}
                    style={[styles.bubble, bubbleStyle]}
                >
                    <Text style={[styles.messageText, textStyle]}>
                        {message.message_text}
                    </Text>
                </TouchableOpacity>

                {/* Timestamp */}
                <Text style={[styles.timestamp, isOwnMessage && styles.timestampOwn]}>
                    {formatMessageTime(message.created_at)}
                </Text>
            </View>

            {/* Spacer for alignment */}
            {!isOwnMessage && !showAvatar && <View style={styles.avatarContainer} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: spacing[1],
        paddingHorizontal: spacing[4],
    },
    containerOwn: {
        justifyContent: 'flex-end',
    },
    avatarContainer: {
        width: 32,
        marginRight: spacing[2],
    },
    bubbleWrapper: {
        maxWidth: '75%',
    },
    bubbleWrapperOwn: {
        alignItems: 'flex-end',
    },
    senderName: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: spacing[1],
        marginLeft: spacing[2],
    },
    bubble: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    bubbleSent: {
        backgroundColor: colors.primary.main,
        borderBottomRightRadius: 4,
    },
    bubbleReceived: {
        backgroundColor: colors.background.tertiary,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        ...typography.body,
        lineHeight: 20,
    },
    textSent: {
        color: colors.text.inverse,
    },
    textReceived: {
        color: colors.text.primary,
    },
    timestamp: {
        ...typography.caption,
        fontSize: 11,
        color: colors.text.tertiary,
        marginTop: spacing[1],
        marginLeft: spacing[2],
    },
    timestampOwn: {
        marginLeft: 0,
        marginRight: spacing[2],
    },
});
