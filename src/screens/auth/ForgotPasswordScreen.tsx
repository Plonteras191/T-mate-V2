// Forgot Password Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, getEmailError } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import type { ForgotPasswordScreenNavigationProp } from '../../types/navigation.types';

export const ForgotPasswordScreen: React.FC = () => {
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleResetPassword = async () => {
        // Validate email
        if (!email.trim()) {
            setEmailError('Email is required');
            return;
        }

        const error = getEmailError(email);
        if (error) {
            setEmailError(error);
            return;
        }

        setIsLoading(true);
        const result = await resetPassword(email);
        setIsLoading(false);

        if (result.success) {
            setEmailSent(true);
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    if (emailSent) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.successContainer}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>✉️</Text>
                    </View>

                    {/* Success Message */}
                    <Text style={styles.successTitle}>Check Your Email</Text>
                    <Text style={styles.successDescription}>
                        We've sent a password reset link to:
                    </Text>
                    <Text style={styles.successEmail}>{email}</Text>
                    <Text style={styles.successDescription}>
                        Click the link in the email to reset your password.
                    </Text>

                    {/* Back to Login Button */}
                    <Button
                        title="Back to Login"
                        onPress={handleLogin}
                        fullWidth
                        style={styles.successButton}
                    />

                    {/* Resend Link */}
                    <TouchableOpacity
                        onPress={() => setEmailSent(false)}
                        style={styles.resendButton}
                    >
                        <Text style={styles.resendText}>
                            Didn't receive email? Try again
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (emailError) setEmailError(null);
                            }}
                            error={emailError || undefined}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Button
                            title="Send Reset Link"
                            onPress={handleResetPassword}
                            loading={isLoading}
                            fullWidth
                            style={styles.resetButton}
                        />
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Remember your password? </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing[6],
        paddingBottom: spacing[8],
    },
    backButton: {
        marginTop: spacing[4],
        paddingVertical: spacing[2],
        alignSelf: 'flex-start',
    },
    backButtonText: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '500',
    },
    header: {
        marginTop: spacing[8],
        marginBottom: spacing[8],
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing[3],
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
    },
    form: {
        marginBottom: spacing[6],
    },
    resetButton: {
        marginTop: spacing[4],
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing[4],
    },
    loginText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    loginLink: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '600',
    },
    // Success state styles
    successContainer: {
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[16],
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.full,
        backgroundColor: colors.success.light + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    icon: {
        fontSize: 48,
    },
    successTitle: {
        ...typography.h2,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing[4],
    },
    successDescription: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing[2],
    },
    successEmail: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '600',
        marginBottom: spacing[4],
    },
    successButton: {
        marginTop: spacing[8],
    },
    resendButton: {
        marginTop: spacing[4],
        paddingVertical: spacing[3],
    },
    resendText: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '500',
    },
});
