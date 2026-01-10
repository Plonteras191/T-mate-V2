// CalendarGrid Component - Monthly calendar grid
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
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
                            style={styles.dayCell}
                            onPress={() => onSelectDate(day.dateString)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.dayContent,
                                    day.isToday && !isSelected && styles.todayContent,
                                    isSelected && styles.selectedContent,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        !day.isCurrentMonth && styles.otherMonthText,
                                        day.isToday && !isSelected && styles.todayText,
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
                            </View>
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
        paddingBottom: spacing[4],
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: spacing[2], // separation from list
        zIndex: 1,
    },
    weekdayRow: {
        flexDirection: 'row',
        paddingVertical: spacing[2],
        marginBottom: spacing[1],
    },
    weekdayCell: {
        flex: 1,
        alignItems: 'center',
    },
    weekdayText: {
        ...typography.caption,
        color: colors.text.tertiary,
        fontWeight: '600',
        textTransform: 'uppercase',
        fontSize: 11,
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
        padding: 2,
    },
    dayContent: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
    },
    todayContent: {
        backgroundColor: colors.surface.secondary,
        borderWidth: 1,
        borderColor: colors.primary.light,
    },
    selectedContent: {
        backgroundColor: colors.primary.main,
        shadowColor: colors.primary.main,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    selectedText: {
        color: colors.text.inverse,
        fontWeight: '700',
    },
    dayText: {
        ...typography.body,
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    otherMonthText: {
        color: colors.text.disabled,
    },
    todayText: {
        color: colors.primary.main,
        fontWeight: '700',
    },
    eventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.primary.main,
        position: 'absolute',
        bottom: 3,
    },
    eventDotSelected: {
        backgroundColor: colors.text.inverse,
    },
});