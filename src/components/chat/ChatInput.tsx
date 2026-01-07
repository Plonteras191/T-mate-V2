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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ChatInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onAttachmentPress?: () => void;
    placeholder?: string;
    disabled?: boolean;
    sending?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChangeText,
    onSend,
    onAttachmentPress,
    placeholder = 'Type a message...',
    disabled = false,
    sending = false,
}) => {
    const canSend = value.trim().length > 0 && !sending && !disabled;

    return (
        <View style={styles.container}>
            {/* Attachment button (optional) */}
            {onAttachmentPress && (
                <TouchableOpacity
                    onPress={onAttachmentPress}
                    style={styles.attachmentButton}
                    disabled={disabled}
                >
                    <Text style={styles.attachmentIcon}>📎</Text>
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
                    <Text style={styles.sendIcon}>➤</Text>
                )}
            </TouchableOpacity>
        </View>
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
        borderRadius: 20,
        paddingHorizontal: spacing[4],
        paddingVertical: Platform.OS === 'ios' ? spacing[2] : spacing[1],
        minHeight: 40,
        maxHeight: 120,
    },
    input: {
        ...typography.body,
        color: colors.text.primary,
        paddingTop: Platform.OS === 'ios' ? 8 : 0,
        paddingBottom: Platform.OS === 'ios' ? 8 : 0,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing[2],
    },
    sendButtonActive: {
        backgroundColor: colors.primary.main,
    },
    sendButtonDisabled: {
        backgroundColor: colors.background.tertiary,
    },
    sendIcon: {
        fontSize: 18,
        color: colors.text.inverse,
    },
});
