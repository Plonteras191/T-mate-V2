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
import { LoadingSpinner, EmptyState } from '../../components/common';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useGroupDetails } from '../../hooks/useGroupDetails';
import type { GroupsScreenProps } from '../../types/navigation.types';
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

    const handleSend = async () => {
        if (!inputText.trim() || sending) return;

        const text = inputText.trim();
        setInputText(''); // Clear immediately for UX
        setSending(true);

        try {
            const success = await sendMessage(text);
            if (!success) {
                // Restore text on failure
                setInputText(text);
            }
        } catch (error) {
            console.error('Error sending message:', error);
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
                    />
                )}

                <View style={styles.inputContainer}>
                    <ChatInput
                        value={inputText}
                        onChangeText={setInputText}
                        onSend={handleSend}
                        sending={sending}
                        placeholder="Type a message..."
                    />
                </View>
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
