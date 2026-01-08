// Sign Up Screen
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
import { Button, Input, LoadingSpinner, IconButton } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { validateSignUp } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { SignUpScreenNavigationProp } from '../../types/navigation.types';

export const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>();
    const { signUp, isLoading } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{
        fullName: string | null;
        email: string | null;
        password: string | null;
        confirmPassword: string | null;
    }>({
        fullName: null,
        email: null,
        password: null,
        confirmPassword: null,
    });

    const handleSignUp = async () => {
        // Validate inputs
        const validation = validateSignUp(fullName, email, password, confirmPassword);
        setErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        // Attempt sign up
        const result = await signUp({ email, password, fullName });

        if (result.success) {
            Alert.alert(
                'Account Created',
                'Please check your email to verify your account before signing in.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('EmailVerification', { email }),
                    },
                ]
            );
        } else {
            Alert.alert('Sign Up Failed', result.message);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Creating account..." />;
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
                    <IconButton
                        icon="arrow-left"
                        onPress={handleBack}
                        variant="ghost"
                        style={styles.backButton}
                    />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join T-mate to find and create study groups
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                if (errors.fullName) setErrors({ ...errors, fullName: null });
                            }}
                            error={errors.fullName || undefined}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            error={errors.email || undefined}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            error={errors.password || undefined}
                            hint="Must be at least 8 characters"
                            isPassword
                            autoCapitalize="none"
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                            }}
                            error={errors.confirmPassword || undefined}
                            isPassword
                            autoCapitalize="none"
                        />

                        <Button
                            title="Sign Up"
                            onPress={handleSignUp}
                            loading={isLoading}
                            fullWidth
                            style={styles.signUpButton}
                        />
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
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
        marginTop: spacing[4],
        marginBottom: spacing[8],
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
    },
    form: {
        marginBottom: spacing[6],
    },
    signUpButton: {
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
});
