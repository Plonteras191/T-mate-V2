// MessageItem Component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChatBubble } from './ChatBubble';
import type { MessageWithSender } from '../../types/chat.types';
import type { UploadedAttachment } from '../../types/attachment.types';
import { spacing } from '../../theme/spacing';

interface MessageItemProps {
    message: MessageWithSender;
    isOwnMessage: boolean;
    isFirstInGroup: boolean;
    isLastInGroup: boolean;
    onAvatarPress?: () => void;
    onLongPress?: () => void;
    onImagePress?: (imageUrl: string) => void;
    onFilePress?: (attachment: UploadedAttachment) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
    message,
    isOwnMessage,
    isFirstInGroup,
    isLastInGroup,
    onAvatarPress,
    onLongPress,
    onImagePress,
    onFilePress,
}) => {
    return (
        <View style={[styles.container, !isLastInGroup && styles.grouped]}>
            <ChatBubble
                message={message}
                isOwnMessage={isOwnMessage}
                showAvatar={isLastInGroup}
                showName={isFirstInGroup && !isOwnMessage}
                onAvatarPress={onAvatarPress}
                onLongPress={onLongPress}
                onImagePress={onImagePress}
                onFilePress={onFilePress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing[2],
    },
    grouped: {
        marginVertical: 2, // Half of spacing[1] for consecutive messages
    },
});
