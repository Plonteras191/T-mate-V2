// Divider Component
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface DividerProps {
    label?: string;
    style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ label, style }) => {
    if (label) {
        return (
            <View style={[styles.containerWithLabel, style]}>
                <View style={styles.line} />
                <Text style={styles.label}>{label}</Text>
                <View style={styles.line} />
            </View>
        );
    }

    return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: colors.border.light,
    },
    containerWithLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border.light,
    },
    label: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginHorizontal: spacing[3],
    },
});
