// ViewUserProfileScreen
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconButton, LoadingSpinner } from '../../components/common';
import { ProfileHeader } from '../../components/profile';
import * as profileService from '../../services/profile.service';
import type { User } from '../../types/database.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

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
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                    />
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileHeader user={profile} showEmail={false} />
                </ScrollView>
            </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: spacing[8],
    },
});
