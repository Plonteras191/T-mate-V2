// DateSeparator Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatMessageDate } from '../../utils/chatUtils';

interface DateSeparatorProps {
    date: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.dateText}>{formatMessageDate(date)}</Text>
            <View style={styles.line} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing[4],
        paddingHorizontal: spacing[4],
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border.light,
    },
    dateText: {
        ...typography.caption,
        fontSize: 12,
        color: colors.text.tertiary,
        paddingHorizontal: spacing[3],
    },
});
