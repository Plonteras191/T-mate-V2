// Profile Stack Navigator
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    ProfileScreen,
    EditProfileScreen,
    ViewUserProfileScreen,
} from '../screens/profile';
import type { ProfileStackParamList } from '../types/navigation.types';
import { colors } from '../theme/colors';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="ProfileMain"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: colors.background.primary },
            }}
        >
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ViewUserProfile" component={ViewUserProfileScreen} />
        </Stack.Navigator>
    );
};
