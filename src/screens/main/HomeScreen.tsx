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
import { Card, LoadingSpinner } from '../../components/common';
import { GroupCard } from '../../components/groups';
import { useAuth } from '../../hooks/useAuth';
import * as groupsService from '../../services/groups.service';
import type { StudyGroupWithDetails } from '../../services/groups.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { HomeHeader } from '../../components/home/HomeHeader';
import { FeaturedCarousel } from '../../components/home/FeaturedCarousel';
import { Feather } from '@expo/vector-icons';

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

    const QuickActionButton = ({ icon, label, onPress, color }: any) => (
        <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: color + '10' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.actionIconContainer, { backgroundColor: color + '20' }]}>
                {icon}
            </View>
            <Text style={[styles.actionLabel, { color: color }]}>{label}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <LoadingSpinner fullScreen message="Loading..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <HomeHeader />

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
                <FeaturedCarousel />

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActions}>
                        <QuickActionButton
                            icon={<Feather name="search" size={24} color={colors.primary.main} />}
                            label="Browse"
                            onPress={navigateToBrowse}
                            color={colors.primary.main}
                        />
                        <QuickActionButton
                            icon={<Feather name="plus" size={24} color={colors.secondary.main} />}
                            label="Create"
                            onPress={navigateToCreate}
                            color={colors.secondary.main}
                        />
                        <QuickActionButton
                            icon={<Feather name="book-open" size={24} color={colors.accent.orange} />}
                            label="My Groups"
                            onPress={navigateToMyGroups}
                            color={colors.accent.orange}
                        />
                    </View>
                </View>

                {/* Recent Groups */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently Created</Text>
                        <TouchableOpacity
                            style={styles.seeAllContainer}
                            onPress={navigateToBrowse}
                        >
                            <Text style={styles.seeAll}>See All</Text>
                            <Feather name="chevron-right" size={16} color={colors.primary.main} />
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

                {/* Bottom padding for TabBar */}
                <View style={{ height: 100 }} />
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
    section: {
        paddingHorizontal: spacing[4],
        marginTop: spacing[2],
        marginBottom: spacing[6],
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
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '600',
        fontSize: 14,
    },
    quickActions: {
        flexDirection: 'row',
        gap: spacing[3],
    },
    actionCard: {
        flex: 1,
        borderRadius: borderRadius.lg,
        padding: spacing[3],
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    actionIconContainer: {
        padding: spacing[3],
        borderRadius: borderRadius.full,
        marginBottom: spacing[2],
    },
    actionLabel: {
        ...typography.caption,
        fontWeight: '600',
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
