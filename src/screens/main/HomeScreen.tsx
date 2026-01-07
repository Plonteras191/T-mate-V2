// HomeScreen
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, LoadingSpinner } from '../../components/common';
import { GroupCard } from '../../components/groups';
import { useAuth } from '../../hooks/useAuth';
import * as groupsService from '../../services/groups.service';
import type { StudyGroupWithDetails } from '../../services/groups.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { getGreeting, formatDate } from '../../utils/formatters';

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const [recentGroups, setRecentGroups] = useState<StudyGroupWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const result = await groupsService.getAllGroups(0);
            if (result.success) {
                setRecentGroups(result.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const navigateToBrowse = () => {
        navigation.navigate('Groups', { screen: 'BrowseGroups' });
    };

    const navigateToCreate = () => {
        navigation.navigate('Groups', { screen: 'CreateGroup' });
    };

    const navigateToMyGroups = () => {
        navigation.navigate('MyGroups');
    };

    const navigateToGroupDetails = (group: StudyGroupWithDetails) => {
        navigation.navigate('Groups', {
            screen: 'GroupDetails',
            params: { groupId: group.id },
        });
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="Loading..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary.main]}
                        tintColor={colors.primary.main}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greeting}>{getGreeting()},</Text>
                        <Text style={styles.userName}>
                            {user?.full_name?.split(' ')[0] || 'Student'}! 👋
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar
                            uri={user?.profile_photo_url}
                            name={user?.full_name || 'User'}
                            size="medium"
                        />
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={navigateToBrowse}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionIcon}>🔍</Text>
                            <Text style={styles.actionLabel}>Browse Groups</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={navigateToCreate}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionIcon}>➕</Text>
                            <Text style={styles.actionLabel}>Create Group</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={navigateToMyGroups}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionIcon}>📚</Text>
                            <Text style={styles.actionLabel}>My Groups</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Groups */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently Created</Text>
                        <TouchableOpacity onPress={navigateToBrowse}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {recentGroups.length > 0 ? (
                        recentGroups.map((group) => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                onPress={() => navigateToGroupDetails(group)}
                            />
                        ))
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>
                                No study groups yet. Be the first to create one!
                            </Text>
                        </Card>
                    )}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
    },
    greetingContainer: {},
    greeting: {
        ...typography.body,
        color: colors.text.secondary,
    },
    userName: {
        ...typography.h2,
        color: colors.text.primary,
    },
    section: {
        paddingHorizontal: spacing[4],
        marginTop: spacing[4],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[3],
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.text.primary,
        marginBottom: spacing[3],
    },
    seeAll: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '500',
    },
    quickActions: {
        flexDirection: 'row',
        gap: spacing[3],
    },
    actionCard: {
        flex: 1,
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        alignItems: 'center',
        ...shadows.sm,
    },
    actionIcon: {
        fontSize: 28,
        marginBottom: spacing[2],
    },
    actionLabel: {
        ...typography.caption,
        color: colors.text.primary,
        textAlign: 'center',
        fontWeight: '500',
    },
    emptyCard: {
        alignItems: 'center',
        padding: spacing[6],
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});
