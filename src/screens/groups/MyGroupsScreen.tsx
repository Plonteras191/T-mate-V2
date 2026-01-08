// MyGroupsScreen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { EmptyState, LoadingSpinner } from '../../components/common';
import { GroupCard } from '../../components/groups';
import { useMyGroups } from '../../hooks/useMyGroups';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

type Tab = 'joined' | 'created';

export const MyGroupsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { joinedGroups, createdGroups, loading, refetch } = useMyGroups();
    const [activeTab, setActiveTab] = useState<Tab>('joined');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleGroupPress = (groupId: string) => {
        navigation.navigate('Groups', {
            screen: 'GroupDetails',
            params: { groupId },
        });
    };

    const handleCreatePress = () => {
        navigation.navigate('Groups', { screen: 'CreateGroup' });
    };

    if (loading && !refreshing) {
        return <LoadingSpinner fullScreen message="Loading groups..." />;
    }

    const displayGroups = activeTab === 'joined'
        ? joinedGroups.map((m) => m.group)
        : createdGroups;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>My Groups</Text>
                </View>

                {/* Tab Toggle */}
                <View style={styles.tabWrapper}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'joined' && styles.tabActive]}
                            onPress={() => setActiveTab('joined')}
                        >
                            <Text style={[styles.tabText, activeTab === 'joined' && styles.tabTextActive]}>
                                Joined ({joinedGroups.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'created' && styles.tabActive]}
                            onPress={() => setActiveTab('created')}
                        >
                            <Text style={[styles.tabText, activeTab === 'created' && styles.tabTextActive]}>
                                Created ({createdGroups.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Groups List */}
                <FlatList
                    data={displayGroups}
                    renderItem={({ item }) => (
                        <GroupCard
                            group={item}
                            onPress={() => handleGroupPress(item.id)}
                            isMember
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[
                        styles.listContent,
                        displayGroups.length === 0 && styles.emptyContainer,
                    ]}
                    ListEmptyComponent={
                        <EmptyState
                            icon={activeTab === 'joined' ? 'book-open' : 'plus-square'}
                            title={activeTab === 'joined' ? 'No groups joined' : 'No groups created'}
                            description={
                                activeTab === 'joined'
                                    ? 'Browse and join study groups to see them here'
                                    : 'Create your first study group and invite others!'
                            }
                            actionLabel={activeTab === 'joined' ? 'Browse Groups' : 'Create Group'}
                            onAction={activeTab === 'joined'
                                ? () => navigation.navigate('Groups', { screen: 'BrowseGroups' })
                                : handleCreatePress
                            }
                        />
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary.main]}
                            tintColor={colors.primary.main}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
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
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    title: {
        ...typography.h2,
        color: colors.text.primary,
    },
    tabWrapper: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[3],
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.tertiary,
        borderRadius: borderRadius.lg,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing[2],
        alignItems: 'center',
        borderRadius: borderRadius.md,
    },
    tabActive: {
        backgroundColor: colors.surface.primary,
        ...Platform.select({
            ios: {
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    tabText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    tabTextActive: {
        color: colors.text.primary,
        fontWeight: '600',
    },
    listContent: {
        padding: spacing[4],
    },
    emptyContainer: {
        flex: 1,
    },
});
