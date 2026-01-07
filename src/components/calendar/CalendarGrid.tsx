// CalendarGrid Component - Monthly calendar grid
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { WEEKDAY_NAMES, CalendarDay as CalendarDayType } from '../../types/calendar.types';

interface CalendarGridProps {
    days: CalendarDayType[];
    selectedDateString: string | null;
    onSelectDate: (dateString: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
    days,
    selectedDateString,
    onSelectDate,
}) => {
    return (
        <View style={styles.container}>
            {/* Weekday headers */}
            <View style={styles.weekdayRow}>
                {WEEKDAY_NAMES.map((day) => (
                    <View key={day} style={styles.weekdayCell}>
                        <Text style={styles.weekdayText}>{day}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar days grid */}
            <View style={styles.daysGrid}>
                {days.map((day, index) => {
                    const isSelected = day.dateString === selectedDateString;
                    const dayNumber = day.date.getDate();

                    return (
                        <TouchableOpacity
                            key={`${day.dateString}-${index}`}
                            style={[
                                styles.dayCell,
                                day.isToday && styles.todayCell,
                                isSelected && styles.selectedCell,
                            ]}
                            onPress={() => onSelectDate(day.dateString)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    !day.isCurrentMonth && styles.otherMonthText,
                                    day.isToday && styles.todayText,
                                    isSelected && styles.selectedText,
                                ]}
                            >
                                {dayNumber}
                            </Text>

                            {/* Event indicator dot */}
                            {day.hasEvents && (
                                <View
                                    style={[
                                        styles.eventDot,
                                        isSelected && styles.eventDotSelected,
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface.primary,
        paddingHorizontal: spacing[2],
        paddingBottom: spacing[3],
    },
    weekdayRow: {
        flexDirection: 'row',
        paddingVertical: spacing[2],
    },
    weekdayCell: {
        flex: 1,
        alignItems: 'center',
    },
    weekdayText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 7 days per row
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing[1],
    },
    todayCell: {
        backgroundColor: colors.primary.light,
        borderRadius: 20,
    },
    selectedCell: {
        backgroundColor: colors.primary.main,
        borderRadius: 20,
    },
    dayText: {
        ...typography.body,
        color: colors.text.primary,
    },
    otherMonthText: {
        color: colors.text.tertiary,
    },
    todayText: {
        color: colors.primary.main,
        fontWeight: '700',
    },
    selectedText: {
        color: colors.text.inverse,
        fontWeight: '700',
    },
    eventDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary.main,
        position: 'absolute',
        bottom: 4,
    },
    eventDotSelected: {
        backgroundColor: colors.text.inverse,
    },
});
