// Reusable Input Component
import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: ViewStyle;
    isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    inputStyle,
    isPassword = false,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const hasError = !!error;

    const getBorderColor = (): string => {
        if (hasError) return colors.border.error;
        if (isFocused) return colors.border.focus;
        return colors.border.light;
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={styles.label}>{label}</Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: getBorderColor(),
                    },
                    isFocused && styles.inputContainerFocused,
                    hasError && styles.inputContainerError,
                ]}
            >
                {leftIcon && (
                    <View style={styles.iconContainer}>
                        {leftIcon}
                    </View>
                )}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? styles.inputWithLeftIcon : null,
                        (rightIcon || isPassword) ? styles.inputWithRightIcon : null,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.text.tertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...textInputProps}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.iconContainer}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.eyeIcon}>
                            {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                        </Text>
                    </TouchableOpacity>
                )}

                {rightIcon && !isPassword && (
                    <View style={styles.iconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>

            {hint && !error && (
                <Text style={styles.hint}>{hint}</Text>
            )}

            {error && (
                <Text style={styles.error}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing[4],
    },
    label: {
        ...typography.label,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface.primary,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        minHeight: 48,
    },
    inputContainerFocused: {
        borderWidth: 2,
        borderColor: colors.border.focus,
    },
    inputContainerError: {
        borderColor: colors.border.error,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text.primary,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    inputWithLeftIcon: {
        paddingLeft: spacing[2],
    },
    inputWithRightIcon: {
        paddingRight: spacing[2],
    },
    iconContainer: {
        paddingHorizontal: spacing[3],
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        fontSize: 18,
    },
    hint: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing[1],
    },
    error: {
        ...typography.caption,
        color: colors.danger.main,
        marginTop: spacing[1],
    },
});
