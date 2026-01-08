import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

import { Feather } from '@expo/vector-icons';

export type CategoryType = 'all' | 'Math' | 'Science' | 'Coding' | 'Languages' | 'Arts' | 'Other';

interface CategoryFilterProps {
    selectedCategory: CategoryType;
    onSelectCategory: (category: CategoryType) => void;
}

const CATEGORIES: CategoryType[] = ['all', 'Math', 'Science', 'Coding', 'Languages', 'Arts', 'Other'];

const CATEGORY_ICONS: Record<CategoryType, keyof typeof Feather.glyphMap> = {
    all: 'grid',
    Math: 'percent',
    Science: 'activity',
    Coding: 'code',
    Languages: 'message-circle',
    Arts: 'pen-tool',
    Other: 'more-horizontal',
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                        ]}
                        onPress={() => onSelectCategory(category)}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={CATEGORY_ICONS[category]}
                            size={14}
                            color={isSelected ? colors.text.inverse : colors.text.secondary}
                            style={styles.icon}
                        />
                        <Text
                            style={[
                                styles.chipText,
                                isSelected && styles.chipTextSelected,
                            ]}
                        >
                            {category === 'all' ? 'All' : category}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing[4],
        gap: spacing[2],
        paddingBottom: spacing[2],
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface.secondary,
        borderWidth: 1,
        borderColor: colors.border.light,
        gap: 6,
    },
    chipSelected: {
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.main,
    },
    icon: {
        marginRight: 2,
    },
    chipText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: colors.text.inverse,
        fontWeight: '600',
    },
});
