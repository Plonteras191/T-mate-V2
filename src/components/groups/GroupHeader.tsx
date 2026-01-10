// GroupHeader Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { formatDateTime, formatMemberCount } from '../../utils/formatters';
import type { StudyGroupWithDetails } from '../../services/groups.service';
import { LinearGradient } from 'expo-linear-gradient';

interface GroupHeaderProps {
    group: StudyGroupWithDetails;
    onCreatorPress?: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
    group,
    onCreatorPress,
}) => {
    // Generate a consistent gradient based on the first char of the subject
    // For now we'll use a nice default indigo/purple gradient
    const gradientColors = [colors.primary.main, colors.primary.dark] as const;

    return (
        <View style={styles.container}>
            {/* Immersive Header Background */}
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerBackground}
            >
                <View style={styles.headerOverlay} />
            </LinearGradient>

            {/* Main Content Card (Overlapping) */}
            <View style={styles.contentContainer}>
                {/* Title and Status */}
                <View style={styles.titleCard}>
                    <View style={styles.headerRow}>
                        <View style={[
                            styles.statusBadge,
                            group.is_full ? styles.statusFull : styles.statusOpen
                        ]}>
                            <Text style={[
                                styles.statusText,
                                group.is_full ? styles.statusTextFull : styles.statusTextOpen
                            ]}>
                                {group.is_full ? 'Full Group' : 'Open for Joining'}
                            </Text>
                        </View>
                        {group.max_capacity && (
                            <View style={styles.capacityBadge}>
                                <Feather name="users" size={12} color={colors.text.secondary} />
                                <Text style={styles.capacityText}>
                                    Max {group.max_capacity}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.subject}>{group.subject}</Text>

                    <TouchableOpacity
                        style={styles.creatorRow}
                        onPress={onCreatorPress}
                        activeOpacity={0.7}
                    >
                        <Avatar
                            uri={group.creator?.profile_photo_url}
                            name={group.creator?.full_name || 'Unknown'}
                            size="small"
                        />
                        <View style={styles.creatorInfo}>
                            <Text style={styles.createdBy}>Hosted by</Text>
                            <Text style={styles.creatorName}>
                                {group.creator?.full_name || 'Unknown'}
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={16} color={colors.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Info Grid */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.iconBox}>
                                <Feather name="calendar" size={20} color={colors.primary.main} />
                            </View>
                            <View style={styles.infoOneContent}>
                                <Text style={styles.infoLabel}>Schedule</Text>
                                <Text style={styles.infoValue}>
                                    {formatDateTime(group.meeting_schedule)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.iconBox}>
                                <Feather name="map-pin" size={20} color={colors.primary.main} />
                            </View>
                            <View style={styles.infoOneContent}>
                                <Text style={styles.infoLabel}>Location</Text>
                                <Text style={styles.infoValue}>
                                    {group.meeting_location}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About this Group</Text>
                    <Text style={styles.description}>{group.description}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing[4],
    },
    headerBackground: {
        height: 180,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    contentContainer: {
        marginTop: 100, // Overlap amount
        paddingHorizontal: spacing[4],
    },
    titleCard: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        ...shadows.lg,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        marginBottom: spacing[4],
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[3],
    },
    statusBadge: {
        paddingHorizontal: spacing[3],
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    statusOpen: {
        backgroundColor: colors.success.light + '20',
    },
    statusFull: {
        backgroundColor: colors.danger.light + '20',
    },
    statusText: {
        ...typography.caption,
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 11,
    },
    statusTextOpen: {
        color: colors.success.main,
    },
    statusTextFull: {
        color: colors.danger.main,
    },
    capacityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.surface.secondary,
        paddingHorizontal: spacing[2],
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    capacityText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontSize: 11,
    },
    subject: {
        ...typography.h2,
        color: colors.text.primary,
        fontSize: 24,
        lineHeight: 32,
        marginBottom: spacing[4],
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: spacing[3],
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    creatorInfo: {
        flex: 1,
        marginLeft: spacing[3],
    },
    createdBy: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginBottom: 2,
    },
    creatorName: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    infoSection: {
        gap: spacing[3],
        marginBottom: spacing[5],
    },
    infoRow: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary.light + '15', // very light indigo
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing[4],
    },
    infoOneContent: {
        flex: 1,
    },
    infoLabel: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginBottom: 2,
        textTransform: 'uppercase',
        fontSize: 11,
        fontWeight: '600',
    },
    infoValue: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
        fontSize: 15,
    },
    section: {
        marginBottom: spacing[4],
        paddingHorizontal: spacing[1],
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing[3],
        fontSize: 18,
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 24,
        fontSize: 15,
    },
});
