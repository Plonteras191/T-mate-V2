// ProfileScreen
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button, Card, LoadingSpinner, Divider } from '../../components/common';
import { ProfileHeader } from '../../components/profile';
import { useAuth } from '../../hooks/useAuth';
import { useMyGroups } from '../../hooks/useMyGroups';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, signOut, isLoading, refreshUser } = useAuth();
    const { joinedGroups, createdGroups, refetch: refetchGroups } = useMyGroups();

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
            'Are you sure you want to logout?',
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
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <ProfileHeader
                    user={user}
                    onEditPress={handleEditProfile}
                    showEditButton
                />

                <Divider style={styles.divider} />

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statNumber}>{joinedGroups.length}</Text>
                        <Text style={styles.statLabel}>Groups Joined</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statNumber}>{createdGroups.length}</Text>
                        <Text style={styles.statLabel}>Groups Created</Text>
                    </Card>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Edit Profile"
                        onPress={handleEditProfile}
                        variant="outline"
                        fullWidth
                        style={styles.actionButton}
                    />
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        variant="danger"
                        fullWidth
                        style={styles.actionButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: spacing[8],
    },
    divider: {
        marginVertical: spacing[4],
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing[4],
        gap: spacing[3],
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing[4],
    },
    statNumber: {
        ...typography.h2,
        color: colors.primary.main,
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing[1],
    },
    actions: {
        paddingHorizontal: spacing[4],
        marginTop: spacing[6],
    },
    actionButton: {
        marginBottom: spacing[3],
    },
});
