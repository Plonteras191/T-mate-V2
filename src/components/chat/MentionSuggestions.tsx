// MentionSuggestions Component - Simple placeholder
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface MentionSuggestionsProps {
    query: string;
    groupId: string;
    visible: boolean;
    onSelect: (user: any) => void;
}

export const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({
    visible,
}) => {
    if (!visible) return null;

    // Simplified - would need to fetch group members
    return (
        <View style={styles.container}>
            <Text style={styles.text}>@mention suggestions (to be implemented)</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: colors.background.tertiary,
    },
    text: {
        ...typography.caption,
        color: colors.text.secondary,
    },
});
