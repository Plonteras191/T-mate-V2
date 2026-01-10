import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { formatTime, formatDate } from '../../utils/formatters';
import type { StudyGroup } from '../../types/database.types';

interface UpcomingSessionCardProps {
    group: StudyGroup;
    onPress: () => void;
}

export const UpcomingSessionCard: React.FC<UpcomingSessionCardProps> = ({ group, onPress }) => {
    const meetingDate = new Date(group.meeting_schedule);
    const isToday = new Date().toDateString() === meetingDate.toDateString();

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <LinearGradient
                colors={['#4F46E5', '#818CF8'] as const}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.header}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {isToday ? 'Happening Today' : 'Up Next'}
                        </Text>
                    </View>
                    <Feather name="arrow-right" size={20} color="#FFF" style={{ opacity: 0.8 }} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.subject} numberOfLines={1}>
                        {group.subject}
                    </Text>
                    <Text style={styles.schedule}>
                        {formatDate(group.meeting_schedule)} • {formatTime(group.meeting_schedule)}
                    </Text>

                    <View style={styles.locationContainer}>
                        <Feather name="map-pin" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.location} numberOfLines={1}>
                            {group.meeting_location}
                        </Text>
                    </View>
                </View>

                {/* Decorative circles */}
                <View style={styles.circle1} />
                <View style={styles.circle2} />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        minHeight: 160,
        position: 'relative',
        overflow: 'hidden',
        ...shadows.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[4],
        zIndex: 2,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.full,
    },
    badgeText: {
        ...typography.caption,
        color: '#FFF',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 10,
        letterSpacing: 0.5,
    },
    content: {
        zIndex: 2,
    },
    subject: {
        ...typography.h2,
        color: '#FFF',
        marginBottom: spacing[1],
        fontSize: 24,
    },
    schedule: {
        ...typography.body,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: spacing[3],
        fontWeight: '500',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.lg,
    },
    location: {
        ...typography.caption,
        color: '#FFF',
        fontWeight: '500',
    },
    circle1: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
    circle2: {
        position: 'absolute',
        bottom: -40,
        left: -20,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.05)',
        zIndex: 1,
    },
});
