// BrowseGroupsScreen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from '../../components/common';
import { GroupList, CategoryFilter, CategoryType, ScheduleFilter, TimeSlotFilter } from '../../components/groups';
import { useGroups } from '../../hooks/useGroups';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { StudyGroupWithDetails } from '../../services/groups.service';
import { Feather } from '@expo/vector-icons';

type FilterType = 'all' | 'open' | 'full';

export const BrowseGroupsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

    const {
        groups,
        loading,
        refreshing,
        refetch,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        dateRangeFilter,
        setDateRangeFilter,
        timeSlotFilter,
        setTimeSlotFilter,
        hasMore,
        loadMore,
        membershipMap,
        joinGroup,
        joiningGroupId,
    } = useGroups();

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All Status', value: 'all' },
        { label: 'Open Only', value: 'open' },
        { label: 'Full', value: 'full' },
    ];

    const handleGroupPress = (group: StudyGroupWithDetails) => {
        navigation.navigate('GroupDetails', { groupId: group.id });
    };

    const handleCreatePress = () => {
        navigation.navigate('CreateGroup');
    };

    // Filter groups locally by category
    const filteredGroups = selectedCategory === 'all'
        ? groups
        : groups.filter(g => {
            // Case-insensitive comparison of subject with category
            const subject = g.subject.toLowerCase();
            const category = selectedCategory.toLowerCase();
            // Check if subject contains the category or starts with it
            return subject.includes(category) || subject.startsWith(category);
        });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Browse Groups</Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreatePress}
                    >
                        <Feather name="plus" size={20} color={colors.primary.main} />
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search by subject, title..."
                    />
                </View>

                {/* Categories */}
                <View style={styles.categoryContainer}>
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </View>

                {/* Status Filters */}
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

                {/* Schedule Filter */}
                <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>When</Text>
                    <ScheduleFilter
                        selectedSchedule={dateRangeFilter}
                        onSelectSchedule={setDateRangeFilter}
                    />
                </View>

                {/* Time Slot Filter */}
                <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Time</Text>
                    <TimeSlotFilter
                        selectedTimeSlot={timeSlotFilter}
                        onSelectTimeSlot={setTimeSlotFilter}
                    />
                </View>

                {/* Groups List */}
                <GroupList
                    groups={filteredGroups}
                    loading={loading}
                    refreshing={refreshing}
                    onRefresh={refetch}
                    onGroupPress={handleGroupPress}
                    onJoinPress={(group) => joinGroup(group.id)}
                    showJoinButton
                    membershipMap={membershipMap}
                    joiningGroupId={joiningGroupId}
                    emptyIcon="search"
                    emptyTitle="No groups found"
                    emptyDescription={selectedCategory !== 'all' ? `No groups found in ${selectedCategory}` : "Try a different search or create your own study group!"}
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
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.main + '15', // light primary bg
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: borderRadius.full,
        gap: 4,
    },
    createButtonText: {
        ...typography.bodySmall,
        color: colors.primary.main,
        fontWeight: '600',
    },
    searchContainer: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[3],
    },
    categoryContainer: {
        marginBottom: spacing[2],
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing[4],
        marginBottom: spacing[2],
        gap: spacing[2],
    },
    filterChip: {
        paddingHorizontal: spacing[3],
        paddingVertical: 6,
        borderRadius: borderRadius.sm,
        backgroundColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary.main,
        borderRadius: 0,
    },
    filterChipText: {
        ...typography.caption,
        color: colors.text.tertiary,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: colors.primary.main,
        fontWeight: '600',
    },
    filterSection: {
        marginBottom: spacing[3],
    },
    filterSectionTitle: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: spacing[4],
        marginBottom: spacing[2],
    },
});