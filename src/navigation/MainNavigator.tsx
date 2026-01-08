// Main Navigator - Bottom Tab navigator for authenticated users
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { HomeScreen } from '../screens/main';
import { MyGroupsScreen } from '../screens/groups';
import { CalendarScreen } from '../screens/calendar';
import { GroupsNavigator } from './GroupsNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { TabBar } from '../components/navigation/TabBar';
import type { MainTabParamList } from '../types/navigation.types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => {
                const focusedRoute = props.state.routes[props.state.index];
                const descriptor = props.descriptors[focusedRoute.key];
                const options = descriptor.options;

                if ((options.tabBarStyle as any)?.display === 'none') {
                    return null;
                }

                return <TabBar {...props} />;
            }}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            <Tab.Screen
                name="Groups"
                component={GroupsNavigator}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'BrowseGroups';
                    const hiddenRoutes = ['CreateGroup', 'EditGroup', 'GroupChat', 'ImageViewer'];

                    if (hiddenRoutes.includes(routeName)) {
                        return {
                            tabBarStyle: { display: 'none' },
                            tabBarLabel: 'Browse',
                        };
                    }

                    return {
                        tabBarLabel: 'Browse',
                    };
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Calendar',
                }}
            />
            <Tab.Screen
                name="MyGroups"
                component={MyGroupsScreen}
                options={{
                    tabBarLabel: 'My Groups',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarLabel: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
};
