// RichTextRenderer Component - Render formatted text with mentions and links
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { MessageFormatting, TextRange } from '../../types/chat.types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface RichTextRendererProps {
    text: string;
    formatting: MessageFormatting | null;
    textColor?: string;
    onMentionPress?: (userId: string) => void;
    onLinkPress?: (url: string) => void;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
    text,
    formatting,
    textColor = colors.text.primary,
    onMentionPress,
    onLinkPress,
}) => {
    if (!formatting) {
        return <Text style={[styles.text, { color: textColor }]}>{text}</Text>;
    }

    // Simple implementation - just render text with basic formatting
    // For a production app, you'd parse the text and apply formatting properly
    const isBold = formatting.bold && formatting.bold.length > 0;
    const isItalic = formatting.italic && formatting.italic.length > 0;
    const isStrikethrough = formatting.strikethrough && formatting.strikethrough.length > 0;

    return (
        <Text
            style={[
                styles.text,
                { color: textColor },
                isBold && styles.bold,
                isItalic && styles.italic,
                isStrikethrough && styles.strikethrough,
            ]}
        >
            {text}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        ...typography.body,
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    strikethrough: {
        textDecorationLine: 'line-through',
    },
    link: {
        color: colors.primary.main,
        textDecorationLine: 'underline',
    },
    mention: {
        color: colors.primary.main,
        fontWeight: '600',
    },
});
