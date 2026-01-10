// ProfileScreen
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LoadingSpinner } from '../../components/common';
import { ProfileHeader } from '../../components/profile';
import { useAuth } from '../../hooks/useAuth';
import { useMyGroups } from '../../hooks/useMyGroups';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Feather } from '@expo/vector-icons';

type MenuItemProps = {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
    showChevron?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onPress,
    isDestructive = false,
    showChevron = true
}) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[
            styles.menuIconBox,
            isDestructive && { backgroundColor: colors.danger.light + '20' }
        ]}>
            <Feather
                name={icon}
                size={20}
                color={isDestructive ? colors.danger.main : colors.primary.main}
            />
        </View>
        <Text style={[
            styles.menuLabel,
            isDestructive && { color: colors.danger.main }
        ]}>
            {label}
        </Text>
        {showChevron && (
            <Feather
                name="chevron-right"
                size={20}
                color={colors.text.tertiary}
            />
        )}
    </TouchableOpacity>
);

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, signOut, isLoading, refreshUser } = useAuth();
    const { joinedGroups, createdGroups, refetch: refetchGroups } = useMyGroups();
    const insets = useSafeAreaInsets();

    // Refetch data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refreshUser();
            refetchGroups();
        }, [refreshUser, refetchGroups])
    );

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout? You will need to sign in again to access your groups.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]
        );
    };

    if (isLoading || !user) {
        return <LoadingSpinner fullScreen message="Loading profile..." />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.headerTitle}>
                    <Text style={styles.screenTitle}>My Profile</Text>
                    <TouchableOpacity
                        onPress={handleEditProfile}
                        style={styles.editButton}
                    >
                        <Feather name="edit-3" size={20} color={colors.primary.main} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.content,
                        { paddingBottom: insets.bottom + 100 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* User Info Card */}
                    <View style={styles.profileCard}>
                        <ProfileHeader
                            user={user}
                            onEditPress={handleEditProfile}
                            showEditButton={false} // Handled by top bar or menu
                        />
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <View style={styles.statIconContainer}>
                                <Feather name="users" size={20} color={colors.secondary.main} />
                            </View>
                            <Text style={styles.statNumber}>{joinedGroups.length}</Text>
                            <Text style={styles.statLabel}>Joined</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIconContainer, { backgroundColor: colors.primary.light + '20' }]}>
                                <Feather name="plus-circle" size={20} color={colors.primary.main} />
                            </View>
                            <Text style={styles.statNumber}>{createdGroups.length}</Text>
                            <Text style={styles.statLabel}>Created</Text>
                        </View>
                    </View>

                    {/* Settings / Actions Menu */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Account Settings</Text>
                        <View style={styles.menuContainer}>
                            <MenuItem
                                icon="user"
                                label="Edit Profile"
                                onPress={handleEditProfile}
                            />
                            <View style={styles.menuDivider} />
                            <MenuItem
                                icon="bell"
                                label="Notifications"
                                onPress={() => { }}
                            />
                            <View style={styles.menuDivider} />
                            <MenuItem
                                icon="lock"
                                label="Privacy & Security"
                                onPress={() => { }}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Support</Text>
                        <View style={styles.menuContainer}>
                            <MenuItem
                                icon="help-circle"
                                label="Help Center"
                                onPress={() => { }}
                            />
                        </View>
                    </View>

                    <View style={[styles.section, styles.logoutSection]}>
                        <View style={styles.menuContainer}>
                            <MenuItem
                                icon="log-out"
                                label="Logout"
                                onPress={handleLogout}
                                isDestructive
                                showChevron={false}
                            />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.versionText}>T-mate v1.0.0</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.tertiary, // Light gray bg
    },
    safeArea: {
        flex: 1,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        backgroundColor: colors.background.tertiary,
    },
    screenTitle: {
        ...typography.h2,
        color: colors.text.primary,
    },
    editButton: {
        padding: spacing[2],
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary.light + '15',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: spacing[8],
        paddingHorizontal: spacing[4],
    },
    profileCard: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.xl,
        marginTop: spacing[2],
        marginBottom: spacing[4],
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        overflow: 'hidden', // Contain the header
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        marginBottom: spacing[5],
        ...shadows.sm,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary.light + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[2],
    },
    statNumber: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: 2,
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border.light,
    },
    section: {
        marginBottom: spacing[4],
    },
    sectionHeader: {
        ...typography.label,
        color: colors.text.secondary,
        marginLeft: spacing[2],
        marginBottom: spacing[2],
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    menuContainer: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[4],
        minHeight: 56,
    },
    menuDivider: {
        height: 1,
        backgroundColor: colors.border.light,
        marginLeft: 56, // indent past icon
    },
    menuIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: colors.primary.light + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing[3],
    },
    menuLabel: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
        flex: 1,
        fontSize: 15,
    },
    logoutSection: {
        marginTop: spacing[2],
    },
    footer: {
        alignItems: 'center',
        marginVertical: spacing[4],
        marginTop: spacing[2],
    },
    versionText: {
        ...typography.caption,
        color: colors.text.disabled,
    },
});
