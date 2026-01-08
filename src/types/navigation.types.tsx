// Navigation types for React Navigation - Phase 2 Update

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp, NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';

// Root Stack
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack - screens before user is authenticated
export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
    EmailVerification: { email: string };
    ForgotPassword: undefined;
};

// Main Bottom Tabs
export type MainTabParamList = {
    Home: undefined;
    Groups: NavigatorScreenParams<GroupsStackParamList>;
    Calendar: undefined;
    MyGroups: undefined;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Groups Stack
export type GroupsStackParamList = {
    BrowseGroups: undefined;
    CreateGroup: undefined;
    EditGroup: { groupId: string };
    GroupDetails: { groupId: string; initialData?: any };
    GroupMembers: { groupId: string; isCreator: boolean };
    GroupChat: { groupId: string; groupName: string };
    ViewUserProfile: { userId: string };
    ImageViewer: { imageUrl: string; senderName?: string };
};

// Profile Stack
export type ProfileStackParamList = {
    ProfileMain: undefined;
    EditProfile: undefined;
    ViewUserProfile: { userId: string };
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

export type AuthScreenProps<T extends keyof AuthStackParamList> =
    StackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;

export type GroupsScreenProps<T extends keyof GroupsStackParamList> =
    CompositeScreenProps<
        StackScreenProps<GroupsStackParamList, T>,
        MainTabScreenProps<keyof MainTabParamList>
    >;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
    CompositeScreenProps<
        StackScreenProps<ProfileStackParamList, T>,
        MainTabScreenProps<keyof MainTabParamList>
    >;

// Legacy exports for Phase 1 compatibility
export type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
export type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;
export type EmailVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailVerification'>;
export type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;
export type SignUpScreenRouteProp = RouteProp<AuthStackParamList, 'SignUp'>;
export type EmailVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'EmailVerification'>;
export type ForgotPasswordScreenRouteProp = RouteProp<AuthStackParamList, 'ForgotPassword'>;
