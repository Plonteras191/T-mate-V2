// Badge Component
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
type BadgeSize = 'small' | 'medium';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    style?: ViewStyle;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
    primary: { bg: colors.primary.light + '30', text: colors.primary.main },
    success: { bg: colors.success.light + '30', text: colors.success.dark },
    warning: { bg: colors.warning.light + '30', text: colors.warning.dark },
    danger: { bg: colors.danger.light + '30', text: colors.danger.dark },
    neutral: { bg: colors.background.tertiary, text: colors.text.secondary },
};

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'primary',
    size = 'small',
    style,
}) => {
    const variantColors = VARIANT_COLORS[variant];
    const isSmall = size === 'small';

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: variantColors.bg,
                    paddingHorizontal: isSmall ? spacing[2] : spacing[3],
                    paddingVertical: isSmall ? spacing[1] : spacing[2],
                },
                style,
            ]}
        >
            <Text
                style={[
                    isSmall ? styles.labelSmall : styles.label,
                    { color: variantColors.text },
                ]}
            >
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    label: {
        ...typography.label,
        fontWeight: '600',
    },
    labelSmall: {
        ...typography.caption,
        fontWeight: '600',
    },
});
