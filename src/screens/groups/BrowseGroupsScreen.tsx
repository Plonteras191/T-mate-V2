// BrowseGroupsScreen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { SearchBar, IconButton } from '../../components/common';
import { GroupList } from '../../components/groups';
import { useGroups } from '../../hooks/useGroups';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { StudyGroupWithDetails } from '../../services/groups.service';

type FilterType = 'all' | 'open' | 'full';

export const BrowseGroupsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const {
        groups,
        loading,
        refreshing,
        refetch,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        hasMore,
        loadMore,
        membershipMap,
        joinGroup,
        joiningGroupId,
    } = useGroups();

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Open', value: 'open' },
        { label: 'Full', value: 'full' },
    ];

    const handleGroupPress = (group: StudyGroupWithDetails) => {
        navigation.navigate('GroupDetails', { groupId: group.id });
    };

    const handleCreatePress = () => {
        navigation.navigate('CreateGroup');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Browse Groups</Text>
                    <IconButton
                        icon="➕"
                        onPress={handleCreatePress}
                        variant="primary"
                        size="medium"
                    />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search by subject..."
                    />
                </View>

                {/* Filter Chips */}
                <View style={styles.filterContainer}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f.value}
                            style={[
                                styles.filterChip,
                                filter === f.value && styles.filterChipActive,
                            ]}
                            onPress={() => setFilter(f.value)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filter === f.value && styles.filterChipTextActive,
                                ]}
                            >
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Groups List */}
                <GroupList
                    groups={groups}
                    loading={loading}
                    refreshing={refreshing}
                    onRefresh={refetch}
                    onGroupPress={handleGroupPress}
                    onJoinPress={(group) => joinGroup(group.id)}
                    showJoinButton
                    membershipMap={membershipMap}
                    joiningGroupId={joiningGroupId}
                    emptyIcon="🔍"
                    emptyTitle="No groups found"
                    emptyDescription="Try a different search or create your own study group!"
                    emptyActionLabel="Create Group"
                    onEmptyAction={handleCreatePress}
                    onEndReached={loadMore}
                    hasMore={hasMore}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    title: {
        ...typography.h2,
        color: colors.text.primary,
    },
    searchContainer: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[3],
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing[4],
        marginBottom: spacing[2],
        gap: spacing[2],
    },
    filterChip: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.tertiary,
    },
    filterChipActive: {
        backgroundColor: colors.primary.main,
    },
    filterChipText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: colors.text.inverse,
    },
});
