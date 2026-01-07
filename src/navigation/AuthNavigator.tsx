// Auth Navigator - Stack navigator for authentication screens
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    LoginScreen,
    SignUpScreen,
    EmailVerificationScreen,
    ForgotPasswordScreen,
} from '../screens/auth';
import type { AuthStackParamList } from '../types/navigation.types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { backgroundColor: 'white' },
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};
