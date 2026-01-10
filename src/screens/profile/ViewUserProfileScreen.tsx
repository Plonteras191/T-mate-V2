// ViewUserProfileScreen
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconButton, LoadingSpinner } from '../../components/common';
import { ProfileHeader } from '../../components/profile';
import * as profileService from '../../services/profile.service';
import type { User } from '../../types/database.types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Feather } from '@expo/vector-icons';

export const ViewUserProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { userId } = route.params;

    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await profileService.getProfile(userId);
            setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);

    if (loading || !profile) {
        return <LoadingSpinner fullScreen message="Loading profile..." />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                        style={styles.backButton}
                    />
                    <Text style={styles.headerTitle}>User Profile</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.profileCard}>
                        <ProfileHeader user={profile} showEmail={false} />
                    </View>

                    {/* Placeholder for future public stats */}
                    <View style={styles.infoCard}>
                        <View style={styles.emptyState}>
                            <Feather name="shield" size={40} color={colors.primary.light} />
                            <Text style={styles.emptyStateText}>
                                {profile.full_name.split(' ')[0]} hasn't shared any public activity yet.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.tertiary,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[3],
    },
    backButton: {
        backgroundColor: colors.surface.primary,
        ...shadows.sm,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.text.primary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing[4],
        paddingBottom: spacing[8],
    },
    profileCard: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.xl,
        marginBottom: spacing[4],
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        overflow: 'hidden',
    },
    infoCard: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        padding: spacing[6],
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    emptyState: {
        alignItems: 'center',
        opacity: 0.7,
    },
    emptyStateText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: spacing[3],
        maxWidth: 200,
    },
});
