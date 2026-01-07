// GroupChatScreen
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { MessageList } from '../../components/chat/MessageList';
import { ChatInput } from '../../components/chat/ChatInput';
import { AttachmentPicker } from '../../components/chat/AttachmentPicker';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useGroupDetails } from '../../hooks/useGroupDetails';
import { useAttachments, useImagePicker, useFilePicker } from '../../hooks';
import { sendMessageWithAttachments } from '../../services/chat.service';
import type { GroupsScreenProps } from '../../types/navigation.types';
import type { UploadedAttachment } from '../../types/attachment.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const GroupChatScreen: React.FC = () => {
    const route = useRoute<GroupsScreenProps<'GroupChat'>['route']>();
    const navigation = useNavigation<GroupsScreenProps<'GroupChat'>['navigation']>();
    const { groupId, groupName } = route.params;
    const { user } = useAuth();

    const {
        messages,
        loading,
        loadingMore,
        hasMore,
        sendMessage,
        loadMoreMessages,
    } = useChat(groupId);

    const { memberCount } = useGroupDetails(groupId);

    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);

    // Attachment hooks
    const attachments = useAttachments();
    const imagePicker = useImagePicker();
    const filePicker = useFilePicker();

    // Handle attachment selection
    const handleImageSelect = async () => {
        const result = await imagePicker.pickImage();
        if (!result.cancelled && result.images) {
            result.images.forEach(img => attachments.addImage(img));
        }
    };

    const handleCameraSelect = async () => {
        const result = await imagePicker.takePhoto();
        if (!result.cancelled && result.images) {
            result.images.forEach(img => attachments.addImage(img));
        }
    };

    const handleFileSelect = async () => {
        const result = await filePicker.pickFile();
        if (!result.cancelled && result.file) {
            attachments.addFile(result.file);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() && attachments.pendingAttachments.length === 0) return;
        if (sending) return;

        const text = inputText.trim();
        setInputText(''); // Clear immediately for UX
        setSending(true);

        try {
            if (attachments.pendingAttachments.length > 0) {
                // Upload attachments first
                const uploaded = await attachments.uploadAll(groupId);

                // Send message with attachments
                const messageType = uploaded.some(a => a.attachment_type === 'image') ? 'image' : 'file';
                await sendMessageWithAttachments(
                    groupId,
                    text || null,
                    messageType,
                    uploaded
                );

                attachments.clearAttachments();
            } else {
                // Send text-only message
                const success = await sendMessage(text);
                if (!success) {
                    // Restore text on failure
                    setInputText(text);
                }
            }
        } catch (error) {
            console.error('Error sending:', error);
            setInputText(text);
        } finally {
            setSending(false);
        }
    };

    const handleAvatarPress = (userId: string) => {
        navigation.navigate('ViewUserProfile', { userId });
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleInfoPress = () => {
        navigation.navigate('GroupDetails', { groupId });
    };

    const handleImagePress = (imageUrl: string) => {
        navigation.navigate('ImageViewer', { imageUrl });
    };

    const handleFilePress = (attachment: UploadedAttachment) => {
        // Handle file download/open
        console.log('Download file:', attachment);
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="Loading chat..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <ChatHeader
                    groupName={groupName}
                    memberCount={memberCount}
                    onBackPress={handleBackPress}
                    onInfoPress={handleInfoPress}
                />

                {messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <EmptyState
                            icon="💬"
                            title="No messages yet"
                            description="Be the first to start the conversation!"
                        />
                    </View>
                ) : (
                    <MessageList
                        messages={messages}
                        currentUserId={user?.id || ''}
                        onLoadMore={loadMoreMessages}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        onAvatarPress={handleAvatarPress}
                        onImagePress={handleImagePress}
                        onFilePress={handleFilePress}
                    />
                )}

                <View style={styles.inputContainer}>
                    <ChatInput
                        value={inputText}
                        onChangeText={setInputText}
                        onSend={handleSend}
                        onAttachmentPress={() => setShowAttachmentPicker(true)}
                        sending={sending}
                        placeholder="Type a message..."
                        pendingAttachments={attachments.pendingAttachments}
                        onRemoveAttachment={attachments.removeAttachment}
                    />
                </View>

                <AttachmentPicker
                    visible={showAttachmentPicker}
                    onImageSelect={handleImageSelect}
                    onCameraSelect={handleCameraSelect}
                    onFileSelect={handleFileSelect}
                    onClose={() => setShowAttachmentPicker(false)}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        backgroundColor: colors.surface.primary,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
});
