import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { SearchBar } from '../common';
import { CategoryFilter, CategoryType } from './CategoryFilter';


interface BrowseHeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: CategoryType;
    setSelectedCategory: (category: CategoryType) => void;
    handleCreatePress: () => void;
    filter: string;
    setFilter: (filter: any) => void;
    filters: { label: string; value: string }[];
}

export const BrowseHeader: React.FC<BrowseHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    handleCreatePress,
    filter,
    setFilter,
    filters,
}) => {
    return (
        <View style={styles.container}>
            {/* Header Title & Create Button */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.subtitle}>Discover</Text>
                    <Text style={styles.title}>Study Groups</Text>
                </View>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreatePress}
                >
                    <Feather name="plus" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>



            {/* Search Bar */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Find your group</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing[2],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4], // Add some top padding
        paddingBottom: spacing[4],
    },
    subtitle: {
        ...typography.bodySmall,
        color: colors.text.tertiary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        ...typography.h2, // Larger, bolder title
        color: colors.text.primary,
        fontWeight: '800',
    },
    createButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary.main,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sectionContainer: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[4],
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.text.primary,
        marginBottom: spacing[3],
        fontWeight: '700',
    },
    categoryContainer: {
        marginBottom: spacing[4],
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing[4],
        marginBottom: spacing[2],
        gap: spacing[2],
    },
    filterChip: {
        paddingHorizontal: spacing[4],
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: colors.primary.light + '15', // very light primary
        borderColor: colors.primary.main,
    },
    filterChipText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    filterChipTextActive: {
        color: colors.primary.main,
        fontWeight: '700',
    },
});
