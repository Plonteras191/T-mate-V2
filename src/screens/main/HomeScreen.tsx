// HomeScreen
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Card, LoadingSpinner } from '../../components/common';
import { GroupCard } from '../../components/groups';
import { HomeHeader } from '../../components/home/HomeHeader';
import { UpcomingSessionCard } from '../../components/home/UpcomingSessionCard';
import { useAuth } from '../../hooks/useAuth';
import { useMyGroups } from '../../hooks/useMyGroups';
import * as groupsService from '../../services/groups.service';
import type { StudyGroupWithDetails } from '../../services/groups.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Feather } from '@expo/vector-icons';

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, refreshUser } = useAuth();
    const { joinedGroups, refetch: refetchMyGroups } = useMyGroups();

    const [recentGroups, setRecentGroups] = useState<StudyGroupWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Calculate next session
    const nextSession = useMemo(() => {
        if (!joinedGroups.length) return null;

        const now = new Date();
        const upcoming = joinedGroups
            .map(m => m.group)
            .filter(g => new Date(g.meeting_schedule) > now)
            .sort((a, b) => new Date(a.meeting_schedule).getTime() - new Date(b.meeting_schedule).getTime());

        return upcoming[0] || null;
    }, [joinedGroups]);

    const fetchData = useCallback(async () => {
        try {
            // Parallel fetching
            const [result] = await Promise.all([
                groupsService.getAllGroups(0),
                refetchMyGroups(),
                refreshUser()
            ]);

            if (result.success) {
                setRecentGroups(result.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching home data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refetchMyGroups, refreshUser]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

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

    const navigateToGroupDetails = (groupId: string) => {
        navigation.navigate('Groups', {
            screen: 'GroupDetails',
            params: { groupId },
        });
    };

    const QuickAction = ({ icon, label, onPress, color, bgColor }: any) => (
        <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: bgColor || colors.surface.primary }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={[styles.actionIconBox, { backgroundColor: color + '15' }]}>
                <Feather name={icon} size={22} color={color} />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    if (loading && !user) {
        return <LoadingSpinner fullScreen message="Loading..." />;
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <HomeHeader />

                <ScrollView
                    style={styles.scrollView}
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
                    {/* Hero Section: Next Session or Welcome */}
                    <View style={styles.heroSection}>
                        {nextSession ? (
                            <UpcomingSessionCard
                                group={nextSession}
                                onPress={() => navigateToGroupDetails(nextSession.id)}
                            />
                        ) : (
                            <View style={styles.welcomeCard}>
                                <View style={styles.welcomeContent}>
                                    <Text style={styles.welcomeTitle}>Find your study squad</Text>
                                    <Text style={styles.welcomeText}>
                                        Join a group to boost your learning or start your own.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.findGroupBtn}
                                        onPress={navigateToBrowse}
                                    >
                                        <Text style={styles.findGroupText}>Find a Group</Text>
                                        <Feather name="arrow-right" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.welcomeDecoration}>
                                    <Feather name="users" size={80} color={colors.primary.main} style={{ opacity: 0.1 }} />
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.actionsRow}>
                        <QuickAction
                            icon="search"
                            label="Browse"
                            onPress={navigateToBrowse}
                            color={colors.primary.main}
                        />
                        <QuickAction
                            icon="plus-square"
                            label="Create Group"
                            onPress={navigateToCreate}
                            color={colors.secondary.main}
                        />
                    </View>

                    {/* Recent Groups Feed */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Explore Groups</Text>
                            <TouchableOpacity
                                style={styles.seeAllContainer}
                                onPress={navigateToBrowse}
                            >
                                <Text style={styles.seeAll}>See All</Text>
                                <Feather name="chevron-right" size={16} color={colors.primary.main} />
                            </TouchableOpacity>
                        </View>

                        {recentGroups.length > 0 ? (
                            <View style={styles.groupsList}>
                                {recentGroups.map((group) => (
                                    <GroupCard
                                        key={group.id}
                                        group={group}
                                        onPress={() => navigateToGroupDetails(group.id)}
                                    />
                                ))}
                            </View>
                        ) : (
                            <Card style={styles.emptyCard}>
                                <Text style={styles.emptyText}>
                                    No study groups found.
                                </Text>
                            </Card>
                        )}
                    </View>

                    {/* Bottom padding for TabBar */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingBottom: spacing[8],
    },
    heroSection: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[6],
    },
    welcomeCard: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.light,
        ...shadows.sm,
    },
    welcomeContent: {
        flex: 1,
        zIndex: 2,
    },
    welcomeTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing[1],
    },
    welcomeText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        marginBottom: spacing[4],
        lineHeight: 20,
    },
    findGroupBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.main,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.lg,
        alignSelf: 'flex-start',
        gap: spacing[2],
    },
    findGroupText: {
        ...typography.buttonSmall,
        color: '#FFF',
    },
    welcomeDecoration: {
        position: 'absolute',
        right: -20,
        bottom: -20,
    },
    actionsRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing[4],
        gap: spacing[3],
        marginBottom: spacing[6],
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[3],
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.03,
    },
    actionIconBox: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing[3],
    },
    actionLabel: {
        ...typography.label,
        color: colors.text.primary,
        fontSize: 14,
    },
    section: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[4],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.text.primary,
    },
    seeAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAll: {
        ...typography.bodySmall,
        color: colors.primary.main,
        fontWeight: '600',
    },
    groupsList: {
        gap: spacing[4],
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
