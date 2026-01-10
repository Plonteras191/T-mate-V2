// TimeSlotFilter Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { TimeSlotFilter as TimeSlotFilterType } from '../../utils/dateFilter.utils';

export type { TimeSlotFilterType };

interface TimeSlotFilterProps {
    selectedTimeSlot: TimeSlotFilterType;
    onSelectTimeSlot: (timeSlot: TimeSlotFilterType) => void;
}

interface TimeSlotOption {
    label: string;
    value: TimeSlotFilterType;
    icon: keyof typeof Feather.glyphMap;
}

const timeSlotOptions: TimeSlotOption[] = [
    { label: 'All Times', value: 'all', icon: 'clock' },
    { label: 'Morning', value: 'morning', icon: 'sunrise' },
    { label: 'Afternoon', value: 'afternoon', icon: 'sun' },
    { label: 'Evening', value: 'evening', icon: 'moon' },
];

export const TimeSlotFilter: React.FC<TimeSlotFilterProps> = ({
    selectedTimeSlot,
    onSelectTimeSlot,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {timeSlotOptions.map((option) => {
                const isActive = selectedTimeSlot === option.value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[styles.chip, isActive && styles.chipActive]}
                        onPress={() => onSelectTimeSlot(option.value)}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={option.icon}
                            size={16}
                            color={isActive ? colors.primary.main : colors.text.tertiary}
                        />
                        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                            {option.label}
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
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        backgroundColor: colors.background.secondary,
        borderWidth: 1.5,
        borderColor: 'transparent',
        gap: 6,
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
