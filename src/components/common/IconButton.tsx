// IconButton Component
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

type IconButtonVariant = 'primary' | 'secondary' | 'ghost';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps {
    icon: string;
    onPress: () => void;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

const SIZES: Record<IconButtonSize, number> = {
    small: 32,
    medium: 44,
    large: 56,
};

const ICON_SIZES: Record<IconButtonSize, number> = {
    small: 16,
    medium: 20,
    large: 24,
};

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    onPress,
    variant = 'ghost',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
}) => {
    const dimension = SIZES[size];
    const iconSize = ICON_SIZES[size];

    const getBackgroundColor = (): string => {
        if (disabled) return colors.background.tertiary;
        switch (variant) {
            case 'primary':
                return colors.primary.main;
            case 'secondary':
                return colors.background.tertiary;
            case 'ghost':
            default:
                return 'transparent';
        }
    };

    const getIconColor = (): string => {
        if (disabled) return colors.text.disabled;
        switch (variant) {
            case 'primary':
                return colors.text.inverse;
            default:
                return colors.text.primary;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.container,
                {
                    width: dimension,
                    height: dimension,
                    borderRadius: dimension / 2,
                    backgroundColor: getBackgroundColor(),
                },
                variant === 'secondary' && shadows.sm,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={getIconColor()} />
            ) : (
                <Text style={[styles.icon, { fontSize: iconSize, color: getIconColor() }]}>
                    {icon}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {},
});
