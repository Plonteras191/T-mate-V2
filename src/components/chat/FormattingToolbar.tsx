// FormattingToolbar Component - Text formatting buttons
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface FormattingToolbarProps {
    onBoldPress: () => void;
    onItalicPress: () => void;
    onStrikethroughPress: () => void;
    onEmojiPress: () => void;
    onMentionPress: () => void;
    activeFormats: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
    };
    visible: boolean;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
    onBoldPress,
    onItalicPress,
    onStrikethroughPress,
    onEmojiPress,
    onMentionPress,
    activeFormats,
    visible,
}) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, activeFormats.bold && styles.activeButton]}
                onPress={onBoldPress}
            >
                <Text style={[styles.buttonText, activeFormats.bold && styles.activeText]}>
                    B
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, activeFormats.italic && styles.activeButton]}
                onPress={onItalicPress}
            >
                <Text
                    style={[
                        styles.buttonText,
                        styles.italic,
                        activeFormats.italic && styles.activeText,
                    ]}
                >
                    I
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, activeFormats.strikethrough && styles.activeButton]}
                onPress={onStrikethroughPress}
            >
                <Text
                    style={[
                        styles.buttonText,
                        styles.strikethrough,
                        activeFormats.strikethrough && styles.activeText,
                    ]}
                >
                    S
                </Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.button} onPress={onEmojiPress}>
                <Text style={styles.emoji}>😀</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onMentionPress}>
                <Text style={styles.buttonText}>@</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        paddingHorizontal: spacing[2],
        backgroundColor: colors.background.tertiary,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    button: {
        width: 40,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginHorizontal: 2,
    },
    activeButton: {
        backgroundColor: colors.primary.main,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.secondary,
    },
    activeText: {
        color: colors.text.inverse,
    },
    italic: {
        fontStyle: 'italic',
    },
    strikethrough: {
        textDecorationLine: 'line-through',
    },
    emoji: {
        fontSize: 20,
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: colors.border.light,
        marginHorizontal: spacing[2],
    },
});
