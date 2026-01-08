// ChatBubble Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import type { MessageWithSender } from '../../types/chat.types';
import type { UploadedAttachment } from '../../types/attachment.types';
import { ImageAttachment } from './ImageAttachment';
import { FileAttachment } from './FileAttachment';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatMessageTime } from '../../utils/chatUtils';
import { isImageType } from '../../utils/fileUtils';

interface ChatBubbleProps {
    message: MessageWithSender;
    isOwnMessage: boolean;
    showAvatar?: boolean;
    showName?: boolean;
    onAvatarPress?: () => void;
    onLongPress?: () => void;
    onImagePress?: (imageUrl: string) => void;
    onFilePress?: (attachment: any) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    message,
    isOwnMessage,
    showAvatar = true,
    showName = true,
    onAvatarPress,
    onLongPress,
    onImagePress,
    onFilePress,
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
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <View style={{ marginBottom: message.message_text ? 8 : 0 }}>
                            {message.attachments.map((attachment: UploadedAttachment, index: number) => {
                                if (attachment.attachment_type === 'image') {
                                    return (
                                        <ImageAttachment
                                            key={attachment.id || index}
                                            attachment={attachment}
                                            onPress={() => onImagePress?.(attachment.file_url)}
                                        />
                                    );
                                } else {
                                    return (
                                        <FileAttachment
                                            key={attachment.id || index}
                                            attachment={attachment}
                                            onPress={() => onFilePress?.(attachment)}
                                        />
                                    );
                                }
                            })}
                        </View>
                    )}

                    {message.message_text && (
                        <Text style={[styles.messageText, textStyle]}>
                            {message.message_text}
                        </Text>
                    )}
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
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    bubbleSent: {
        backgroundColor: colors.primary.main,
        borderBottomRightRadius: 4,
    },
    bubbleReceived: {
        backgroundColor: colors.background.secondary,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        ...typography.body,
        lineHeight: 22,
        fontSize: 15,
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
