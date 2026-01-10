// Reusable Button Component
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
    icon,
}) => {
    const isDisabled = disabled || loading;

    const getBackgroundColor = (): string => {
        if (isDisabled) return colors.border.light;

        switch (variant) {
            case 'primary':
                return colors.primary.main;
            case 'secondary':
                return colors.secondary.main;
            case 'danger':
                return colors.danger.main;
            case 'outline':
            case 'ghost':
                return colors.transparent;
            default:
                return colors.primary.main;
        }
    };

    const getTextColor = (): string => {
        if (isDisabled) return colors.text.disabled;

        switch (variant) {
            case 'primary':
            case 'secondary':
            case 'danger':
                return colors.text.inverse;
            case 'outline':
                return colors.primary.main;
            case 'ghost':
                return colors.primary.main;
            default:
                return colors.text.inverse;
        }
    };

    const getBorderColor = (): string => {
        if (isDisabled) return colors.border.light;

        switch (variant) {
            case 'outline':
                return colors.primary.main;
            default:
                return colors.transparent;
        }
    };

    const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
        switch (size) {
            case 'small':
                return { paddingVertical: spacing[2], paddingHorizontal: spacing[3] };
            case 'large':
                return { paddingVertical: spacing[4], paddingHorizontal: spacing[6] };
            case 'medium':
            default:
                return { paddingVertical: spacing[3], paddingHorizontal: spacing[5] };
        }
    };

    const getFontSize = (): number => {
        switch (size) {
            case 'small':
                return typography.buttonSmall.fontSize;
            case 'large':
                return typography.button.fontSize + 2;
            case 'medium':
            default:
                return typography.button.fontSize;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    ...getPadding(),
                },
                variant !== 'ghost' && shadows.sm,
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={getTextColor()}
                />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize: getFontSize(),
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        minHeight: 44, // Accessible touch target
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontWeight: typography.button.fontWeight,
        textAlign: 'center',
    },
    iconContainer: {
        marginRight: spacing[2],
    }
});
