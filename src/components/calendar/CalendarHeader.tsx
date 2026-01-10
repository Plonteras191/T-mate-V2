// CalendarHeader Component - Month navigation
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { MONTH_NAMES } from '../../types/calendar.types';

interface CalendarHeaderProps {
    year: number;
    month: number;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    year,
    month,
    onPreviousMonth,
    onNextMonth,
    onToday,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={onToday} style={styles.todayButton}>
                    <Text style={styles.todayButtonText}>Today</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
            </View>

            <View style={styles.navigationRow}>
                <TouchableOpacity
                    onPress={onPreviousMonth}
                    style={styles.iconButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Feather name="chevron-left" size={24} color={colors.text.primary} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.monthTitle}>
                        {MONTH_NAMES[month]}
                    </Text>
                    <Text style={styles.yearTitle}>{year}</Text>
                </View>

                <TouchableOpacity
                    onPress={onNextMonth}
                    style={styles.iconButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Feather name="chevron-right" size={24} color={colors.text.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface.primary,
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[2],
        paddingTop: spacing[2],
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: spacing[1],
    },
    todayButton: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        backgroundColor: colors.surface.secondary,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    todayButtonText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    navigationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing[1],
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface.secondary,
    },
    titleContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: spacing[2],
    },
    monthTitle: {
        ...typography.h3,
        color: colors.text.primary,
        fontSize: 24, // Slightly larger
    },
    yearTitle: {
        ...typography.h3,
        color: colors.text.secondary,
        fontWeight: '400',
    },
});