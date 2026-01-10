// MeetingCard Component - Display meeting details
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import type { CalendarEvent } from '../../types/calendar.types';

interface MeetingCardProps {
    event: CalendarEvent;
    onPress: () => void;
    onAddToCalendar: (event: CalendarEvent) => Promise<void>;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
    event,
    onPress,
    onAddToCalendar,
}) => {
    const [adding, setAdding] = useState(false);

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleAddToCalendar = async () => {
        setAdding(true);
        try {
            await onAddToCalendar(event);
            Alert.alert('Success', 'Meeting added to your calendar!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to calendar');
        } finally {
            setAdding(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.95}
        >
            {/* Left side accent bar */}
            <View style={styles.accentBar} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {event.title}
                        </Text>
                        {event.isCreator && (
                            <View style={styles.adminBadge}>
                                <Text style={styles.adminText}>Admin</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.calendarButton}
                        onPress={handleAddToCalendar}
                        disabled={adding}
                    >
                        <Feather
                            name={adding ? "loader" : "calendar"}
                            size={18}
                            color={colors.primary.main}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.timeContainer}>
                    <Feather name="clock" size={14} color={colors.primary.main} />
                    <Text style={styles.timeText}>{formatTime(event.startDate)}</Text>
                </View>

                {event.description ? (
                    <Text style={styles.description} numberOfLines={2}>
                        {event.description}
                    </Text>
                ) : null}

                <View style={styles.footer}>
                    <View style={styles.detailItem}>
                        <Feather name="map-pin" size={14} color={colors.text.tertiary} />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {event.location}
                        </Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Feather name="users" size={14} color={colors.text.tertiary} />
                        <Text style={styles.detailText}>
                            {event.memberCount}
                            {event.maxCapacity ? `/${event.maxCapacity}` : ''}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        marginHorizontal: spacing[4],
        marginBottom: spacing[3],
        ...shadows.sm,
        shadowColor: '#000',
        elevation: 2,
        overflow: 'hidden',
    },
    accentBar: {
        width: 4,
        backgroundColor: colors.primary.main,
    },
    content: {
        flex: 1,
        padding: spacing[4],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[1],
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing[2],
    },
    title: {
        ...typography.h4,
        color: colors.text.primary,
        fontWeight: '700',
        fontSize: 16,
    },
    adminBadge: {
        backgroundColor: colors.primary.light + '20', // lighter opacity
        paddingHorizontal: spacing[2],
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
        marginLeft: spacing[2],
    },
    adminText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary.main,
        textTransform: 'uppercase',
    },
    calendarButton: {
        padding: spacing[2],
        backgroundColor: colors.surface.secondary,
        borderRadius: borderRadius.full,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[2],
    },
    timeText: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '600',
        fontSize: 14,
        marginLeft: spacing[1],
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        fontSize: 14,
        marginBottom: spacing[3],
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        paddingTop: spacing[2],
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        flexShrink: 1,
    },
    detailText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontSize: 13,
    },
});