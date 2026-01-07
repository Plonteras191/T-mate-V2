// MeetingCard Component - Display meeting details
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
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

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
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
            activeOpacity={0.7}
        >
            {/* Time indicator */}
            <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{formatTime(event.startDate)}</Text>
                <View style={styles.timeLine} />
            </View>

            {/* Meeting details */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {event.title}
                    </Text>
                    {event.isCreator && (
                        <View style={styles.creatorBadge}>
                            <Text style={styles.creatorText}>Admin</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {event.description}
                </Text>

                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📍</Text>
                        <Text style={styles.detailText} numberOfLines={1}>
                            {event.location}
                        </Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>👥</Text>
                        <Text style={styles.detailText}>
                            {event.memberCount}
                            {event.maxCapacity ? `/${event.maxCapacity}` : ''} members
                        </Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Text style={styles.detailIcon}>📅</Text>
                        <Text style={styles.detailText}>
                            {formatDate(event.startDate)}
                        </Text>
                    </View>
                </View>

                {/* Add to calendar button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddToCalendar}
                    disabled={adding}
                >
                    <Text style={styles.addButtonIcon}>📲</Text>
                    <Text style={styles.addButtonText}>
                        {adding ? 'Adding...' : 'Add to Calendar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface.primary,
        borderRadius: 12,
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
        padding: spacing[3],
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    timeColumn: {
        alignItems: 'center',
        marginRight: spacing[3],
        width: 50,
    },
    timeText: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '600',
    },
    timeLine: {
        flex: 1,
        width: 2,
        backgroundColor: colors.primary.light,
        marginTop: spacing[2],
        borderRadius: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[1],
    },
    title: {
        ...typography.h4,
        color: colors.text.primary,
        flex: 1,
    },
    creatorBadge: {
        backgroundColor: colors.primary.light,
        paddingHorizontal: spacing[2],
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: spacing[2],
    },
    creatorText: {
        ...typography.caption,
        color: colors.primary.main,
        fontSize: 10,
        fontWeight: '600',
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing[2],
    },
    details: {
        marginBottom: spacing[2],
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[1],
    },
    detailIcon: {
        fontSize: 14,
        marginRight: spacing[2],
    },
    detailText: {
        ...typography.caption,
        color: colors.text.secondary,
        flex: 1,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary.light,
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[3],
        borderRadius: 8,
        marginTop: spacing[1],
    },
    addButtonIcon: {
        fontSize: 16,
        marginRight: spacing[2],
    },
    addButtonText: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '600',
    },
});
