// CalendarHeader Component - Month navigation
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
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
            <View style={styles.navigation}>
                <TouchableOpacity
                    onPress={onPreviousMonth}
                    style={styles.navButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.navButtonText}>◀</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onToday} style={styles.titleContainer}>
                    <Text style={styles.monthTitle}>
                        {MONTH_NAMES[month]} {year}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onNextMonth}
                    style={styles.navButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.navButtonText}>▶</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onToday} style={styles.todayButton}>
                <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        backgroundColor: colors.surface.primary,
    },
    navigation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        padding: spacing[2],
    },
    navButtonText: {
        fontSize: 16,
        color: colors.primary.main,
    },
    titleContainer: {
        paddingHorizontal: spacing[4],
    },
    monthTitle: {
        ...typography.h3,
        color: colors.text.primary,
    },
    todayButton: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        backgroundColor: colors.primary.light,
        borderRadius: 16,
    },
    todayButtonText: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '600',
    },
});
