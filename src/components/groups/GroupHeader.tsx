// GroupHeader Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatDateTime, formatMemberCount } from '../../utils/formatters';
import type { StudyGroupWithDetails } from '../../services/groups.service';

interface GroupHeaderProps {
    group: StudyGroupWithDetails;
    onCreatorPress?: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
    group,
    onCreatorPress,
}) => {
    return (
        <View style={styles.container}>
            {/* Title Section */}
            <View style={styles.titleSection}>
                <Text style={styles.subject}>{group.subject}</Text>
                <View style={styles.statusBadge}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: group.is_full ? colors.danger.main : colors.success.main }
                    ]} />
                    <Text style={[
                        styles.statusText,
                        { color: group.is_full ? colors.danger.main : colors.success.main }
                    ]}>
                        {group.is_full ? 'Full' : 'Open'}
                    </Text>
                </View>
            </View>

            {/* Creator Section */}
            <TouchableOpacity
                style={styles.creatorCard}
                onPress={onCreatorPress}
                activeOpacity={0.7}
            >
                <Avatar
                    uri={group.creator?.profile_photo_url}
                    name={group.creator?.full_name || 'Unknown'}
                    size="medium"
                />
                <View style={styles.creatorInfo}>
                    <Text style={styles.createdBy}>Created by</Text>
                    <Text style={styles.creatorName}>
                        {group.creator?.full_name || 'Unknown'}
                    </Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>

            {/* Description */}
            <Text style={styles.description}>{group.description}</Text>

            {/* Details Cards */}
            <View style={styles.detailsGrid}>
                <View style={styles.detailCard}>
                    <View style={styles.iconContainer}>
                        <Feather name="calendar" size={20} color={colors.primary.main} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Schedule</Text>
                        <Text style={styles.detailValue} numberOfLines={2}>
                            {formatDateTime(group.meeting_schedule)}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailCard}>
                    <View style={styles.iconContainer}>
                        <Feather name="map-pin" size={20} color={colors.primary.main} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Location</Text>
                        <Text style={styles.detailValue} numberOfLines={2}>
                            {group.meeting_location}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailCard}>
                    <View style={styles.iconContainer}>
                        <Feather name="users" size={20} color={colors.primary.main} />
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Members</Text>
                        <Text style={styles.detailValue}>
                            {formatMemberCount(group.member_count, group.max_capacity)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing[4],
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
        gap: spacing[3],
    },
    subject: {
        ...typography.h1,
        color: colors.text.primary,
        flex: 1,
        fontSize: 26,
        lineHeight: 32,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        paddingHorizontal: spacing[3],
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        ...typography.caption,
        fontWeight: '600',
    },
    creatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface.secondary,
        padding: spacing[3],
        borderRadius: borderRadius.lg,
        marginBottom: spacing[4],
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    creatorInfo: {
        flex: 1,
        marginLeft: spacing[3],
    },
    createdBy: {
        ...typography.caption,
        color: colors.text.tertiary,
    },
    creatorName: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '600',
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 24,
        marginBottom: spacing[5],
    },
    detailsGrid: {
        gap: spacing[3],
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary.light + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing[3],
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontSize: 11,
    },
    detailValue: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
    },
});
