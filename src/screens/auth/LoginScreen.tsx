// Login Screen
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
import { Button, Input, LoadingSpinner } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { validateLogin } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { LoginScreenNavigationProp } from '../../types/navigation.types';

export const LoginScreen: React.FC = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { signIn, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email: string | null; password: string | null }>({
        email: null,
        password: null,
    });

    const handleLogin = async () => {
        // Validate inputs
        const validation = validateLogin(email, password);
        setErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        // Attempt sign in
        const result = await signIn({ email, password });

        if (!result.success) {
            Alert.alert('Login Failed', result.message);
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Signing in..." />;
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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>📚</Text>
                        <Text style={styles.title}>T-mate</Text>
                        <Text style={styles.subtitle}>Study Group Finder</Text>
                    </View>

                    {/* Welcome Text */}
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeTitle}>Welcome Back!</Text>
                        <Text style={styles.welcomeText}>
                            Sign in to continue finding and joining study groups
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
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            error={errors.email || undefined}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            error={errors.password || undefined}
                            isPassword
                            autoCapitalize="none"
                        />

                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={styles.forgotPasswordContainer}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Login"
                            onPress={handleLogin}
                            loading={isLoading}
                            fullWidth
                            style={styles.loginButton}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
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
    header: {
        alignItems: 'center',
        marginTop: spacing[10],
        marginBottom: spacing[8],
    },
    logo: {
        fontSize: 64,
        marginBottom: spacing[2],
    },
    title: {
        ...typography.h1,
        color: colors.primary.main,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        marginTop: spacing[1],
    },
    welcomeContainer: {
        marginBottom: spacing[8],
    },
    welcomeTitle: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    welcomeText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    form: {
        marginBottom: spacing[6],
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: -spacing[2],
        marginBottom: spacing[4],
    },
    forgotPasswordText: {
        ...typography.bodySmall,
        color: colors.primary.main,
        fontWeight: '500',
    },
    loginButton: {
        marginTop: spacing[2],
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing[6],
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border.light,
    },
    dividerText: {
        ...typography.bodySmall,
        color: colors.text.tertiary,
        marginHorizontal: spacing[4],
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    signUpLink: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '600',
    },
});
