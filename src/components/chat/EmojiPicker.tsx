// EmojiPicker Component - Simple emoji picker
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface EmojiPickerProps {
    visible: boolean;
    onEmojiSelect: (emoji: string) => void;
    onClose: () => void;
}

const EMOJI_CATEGORIES = {
    smileys: [
        '😀',
        '😃',
        '😄',
        '😁',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '😉',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '🤔',
        '🤨',
        '😐',
        '😑',
        '😶',
        '🙄',
        '😏',
        '😮',
        '😯',
        '😲',
        '😳',
        '🥺',
        '😢',
        '😭',
    ],
    gestures: [
        '👍',
        '👎',
        '👌',
        '✌️',
        '🤞',
        '🤟',
        '🤘',
        '🤙',
        '👈',
        '👉',
        '👆',
        '👇',
        '✋',
        '👋',
        '🤝',
        '👏',
        '🙌',
        '🙏',
        '💪',
    ],
    hearts: [
        '❤️',
        '🧡',
        '💛',
        '💚',
        '💙',
        '💜',
        '🖤',
        '🤍',
        '🤎',
        '💔',
        '❣️',
        '💕',
        '💞',
        '💓',
        '💗',
        '💖',
        '💘',
        '💝',
    ],
    objects: [
        '📚',
        '📖',
        '📝',
        '✏️',
        '📎',
        '📁',
        '📂',
        '📅',
        '📆',
        '⏰',
        '📱',
        '💻',
        '🖥️',
        '📧',
        '💡',
        '🔔',
        '🎓',
        '🏆',
        '🎯',
        '🎉',
        '🎊',
    ],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
    visible,
    onEmojiSelect,
    onClose,
}) => {
    const allEmojis = [
        ...EMOJI_CATEGORIES.smileys,
        ...EMOJI_CATEGORIES.gestures,
        ...EMOJI_CATEGORIES.hearts,
        ...EMOJI_CATEGORIES.objects,
    ];

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Emojis</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.emojiGrid} showsVerticalScrollIndicator={false}>
                        <View style={styles.row}>
                            {allEmojis.map((emoji, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.emojiButton}
                                    onPress={() => {
                                        onEmojiSelect(emoji);
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.emoji}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.surface.primary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    title: {
        ...typography.h4,
        color: colors.text.primary,
    },
    closeButton: {
        fontSize: 24,
        color: colors.text.secondary,
    },
    emojiGrid: {
        flex: 1,
        paddingHorizontal: spacing[2],
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: spacing[2],
    },
    emojiButton: {
        width: '12.5%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 28,
    },
});
