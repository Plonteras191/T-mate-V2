// SystemMessage Component
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SystemMessageProps {
    text: string;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ text }) => {
    return <Text style={styles.systemMessage}>{text}</Text>;
};

const styles = StyleSheet.create({
    systemMessage: {
        ...typography.caption,
        color: colors.text.tertiary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
    },
});
