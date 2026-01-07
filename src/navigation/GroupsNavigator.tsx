// Groups Stack Navigator
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    BrowseGroupsScreen,
    CreateGroupScreen,
    EditGroupScreen,
    GroupDetailsScreen,
    GroupMembersScreen,
} from '../screens/groups';
import { GroupChatScreen, ImageViewerScreen } from '../screens/chat';
import { ViewUserProfileScreen } from '../screens/profile';
import type { GroupsStackParamList } from '../types/navigation.types';
import { colors } from '../theme/colors';

const Stack = createStackNavigator<GroupsStackParamList>();

export const GroupsNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="BrowseGroups"
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: colors.background.primary },
            }}
        >
            <Stack.Screen name="BrowseGroups" component={BrowseGroupsScreen} />
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
            <Stack.Screen name="EditGroup" component={EditGroupScreen} />
            <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
            <Stack.Screen name="GroupMembers" component={GroupMembersScreen} />
            <Stack.Screen name="GroupChat" component={GroupChatScreen} />
            <Stack.Screen name="ViewUserProfile" component={ViewUserProfileScreen} />
            <Stack.Screen
                name="ImageViewer"
                component={ImageViewerScreen}
                options={{ headerShown: false, presentation: 'fullScreenModal' }}
            />
        </Stack.Navigator>
    );
};
