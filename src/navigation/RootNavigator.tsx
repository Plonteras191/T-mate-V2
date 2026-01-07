// Root Navigator - Handles auth state and switches between Auth and Main navigators
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { LoadingSpinner } from '../components/common';

export const RootNavigator: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading spinner while checking auth state
    if (isLoading) {
        return <LoadingSpinner fullScreen message="Loading..." />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};
