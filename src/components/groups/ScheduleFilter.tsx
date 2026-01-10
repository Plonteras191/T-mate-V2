// ScheduleFilter Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { DateRangeFilter } from '../../utils/dateFilter.utils';

export type { DateRangeFilter };

interface ScheduleFilterProps {
    selectedSchedule: DateRangeFilter;
    onSelectSchedule: (schedule: DateRangeFilter) => void;
}

const scheduleOptions: { label: string; value: DateRangeFilter }[] = [
    { label: 'All Dates', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
];

export const ScheduleFilter: React.FC<ScheduleFilterProps> = ({
    selectedSchedule,
    onSelectSchedule,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {scheduleOptions.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.chip,
                        selectedSchedule === option.value && styles.chipActive,
                    ]}
                    onPress={() => onSelectSchedule(option.value)}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.chipText,
                            selectedSchedule === option.value && styles.chipTextActive,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing[4],
        gap: spacing[2],
    },
    chip: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.secondary,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: colors.primary.light + '15',
        borderColor: colors.primary.main,
    },
    chipText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    chipTextActive: {
        color: colors.primary.main,
        fontWeight: '700',
    },
});
