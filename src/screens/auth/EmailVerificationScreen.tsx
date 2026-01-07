// Email Verification Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import type {
    EmailVerificationScreenNavigationProp,
    EmailVerificationScreenRouteProp,
} from '../../types/navigation.types';

export const EmailVerificationScreen: React.FC = () => {
    const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
    const route = useRoute<EmailVerificationScreenRouteProp>();
    const { resendVerificationEmail } = useAuth();

    const [isResending, setIsResending] = useState(false);
    const email = route.params?.email || '';

    const handleResendEmail = async () => {
        if (!email) {
            Alert.alert('Error', 'Email address not found. Please try signing up again.');
            return;
        }

        setIsResending(true);
        const result = await resendVerificationEmail(email);
        setIsResending(false);

        if (result.success) {
            Alert.alert('Email Sent', 'A new verification email has been sent to your inbox.');
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const handleBackToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Email Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>📧</Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>Verify Your Email</Text>

                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        We've sent a verification email to:
                    </Text>
                    <Text style={styles.email}>{email || 'your email'}</Text>
                    <Text style={styles.description}>
                        Please check your inbox and click the verification link to activate your account.
                    </Text>
                </View>

                {/* Tips Card */}
                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>Didn't receive the email?</Text>
                    <Text style={styles.tipsText}>• Check your spam or junk folder</Text>
                    <Text style={styles.tipsText}>• Make sure you entered the correct email</Text>
                    <Text style={styles.tipsText}>• Wait a few minutes and try again</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Resend Verification Email"
                        onPress={handleResendEmail}
                        loading={isResending}
                        fullWidth
                        variant="primary"
                    />

                    <TouchableOpacity
                        onPress={handleBackToLogin}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[12],
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary.light + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    icon: {
        fontSize: 48,
    },
    title: {
        ...typography.h2,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing[4],
    },
    descriptionContainer: {
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing[2],
    },
    email: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '600',
        marginBottom: spacing[2],
    },
    tipsCard: {
        backgroundColor: colors.surface.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        marginBottom: spacing[8],
        width: '100%',
        ...shadows.sm,
    },
    tipsTitle: {
        ...typography.label,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    tipsText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        marginBottom: spacing[1],
    },
    buttonContainer: {
        width: '100%',
    },
    backButton: {
        marginTop: spacing[4],
        paddingVertical: spacing[3],
        alignItems: 'center',
    },
    backButtonText: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '500',
    },
});
