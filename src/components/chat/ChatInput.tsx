// ChatInput Component
import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { PendingAttachment } from '../../types/attachment.types';
import { AttachmentPreview } from './AttachmentPreview';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onAttachmentPress?: () => void;
    placeholder?: string;
    disabled?: boolean;
    sending?: boolean;
    pendingAttachments?: PendingAttachment[];
    onRemoveAttachment?: (id: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChangeText,
    onSend,
    onAttachmentPress,
    placeholder = 'Type a message...',
    disabled = false,
    sending = false,
    pendingAttachments,
    onRemoveAttachment,
}) => {
    const canSend = (value.trim().length > 0 || (pendingAttachments && pendingAttachments.length > 0)) && !sending && !disabled;

    return (
        <>
            {pendingAttachments && pendingAttachments.length > 0 && onRemoveAttachment && (
                <AttachmentPreview
                    attachments={pendingAttachments}
                    onRemove={onRemoveAttachment}
                />
            )}
            <View style={styles.container}>
                {/* Attachment button (optional) */}
                {onAttachmentPress && (
                    <TouchableOpacity
                        onPress={onAttachmentPress}
                        style={styles.attachmentButton}
                        disabled={disabled}
                    >
                        <Feather name="paperclip" size={24} color={colors.text.secondary} />
                    </TouchableOpacity>
                )}

                {/* Text input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={colors.text.tertiary}
                        multiline
                        maxLength={1000}
                        editable={!disabled}
                    />
                </View>

                {/* Send button */}
                <TouchableOpacity
                    onPress={onSend}
                    style={[
                        styles.sendButton,
                        canSend && styles.sendButtonActive,
                        !canSend && styles.sendButtonDisabled,
                    ]}
                    disabled={!canSend}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color={colors.text.inverse} />
                    ) : (
                        <Feather name="send" size={20} color={canSend ? colors.text.inverse : colors.text.disabled} />
                    )}
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        backgroundColor: colors.surface.primary,
    },
    attachmentButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing[2],
    },
    attachmentIcon: {
        fontSize: 20,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing[4],
        paddingVertical: Platform.OS === 'ios' ? spacing[2] : spacing[1],
        minHeight: 40,
        maxHeight: 120,
        marginRight: spacing[2],
    },
    input: {
        ...typography.body,
        color: colors.text.primary,
        paddingTop: Platform.OS === 'ios' ? 8 : 4,
        paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonActive: {
        backgroundColor: colors.primary.main,
        ...shadows.sm,
    },
    sendButtonDisabled: {
        backgroundColor: colors.background.tertiary,
    },
});
