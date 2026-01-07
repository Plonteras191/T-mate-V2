// Main Navigator - Bottom Tab navigator for authenticated users
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';
import { HomeScreen } from '../screens/main';
import { MyGroupsScreen } from '../screens/groups';
import { GroupsNavigator } from './GroupsNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import type { MainTabParamList } from '../types/navigation.types';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
    icon: string;
    focused: boolean;
    label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused, label }) => (
    <View style={styles.tabIconContainer}>
        <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
            {icon}
        </Text>
    </View>
);

export const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary.main,
                tabBarInactiveTintColor: colors.text.tertiary,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
                tabBarItemStyle: styles.tabItem,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🏠" focused={focused} label="Home" />
                    ),
                }}
            />
            <Tab.Screen
                name="Groups"
                component={GroupsNavigator}
                options={{
                    tabBarLabel: 'Browse',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🔍" focused={focused} label="Browse" />
                    ),
                }}
            />
            <Tab.Screen
                name="MyGroups"
                component={MyGroupsScreen}
                options={{
                    tabBarLabel: 'My Groups',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="📚" focused={focused} label="My Groups" />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="👤" focused={focused} label="Profile" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.surface.primary,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        paddingTop: spacing[1],
        paddingBottom: spacing[2],
        height: 65,
    },
    tabLabel: {
        ...typography.caption,
        marginTop: 2,
    },
    tabItem: {
        paddingTop: spacing[1],
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 22,
        opacity: 0.6,
    },
    tabIconFocused: {
        opacity: 1,
    },
});
