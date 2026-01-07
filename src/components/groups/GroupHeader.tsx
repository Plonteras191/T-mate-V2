// GroupHeader Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
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
            <View style={styles.titleRow}>
                <Text style={styles.subject}>{group.subject}</Text>
                <Badge
                    label={group.is_full ? 'Full' : 'Open'}
                    variant={group.is_full ? 'danger' : 'success'}
                />
            </View>

            <View style={styles.creatorRow}>
                <Avatar
                    uri={group.creator?.profile_photo_url}
                    name={group.creator?.full_name || 'Unknown'}
                    size="medium"
                    onPress={onCreatorPress}
                />
                <View style={styles.creatorInfo}>
                    <Text style={styles.createdBy}>Created by</Text>
                    <Text style={styles.creatorName}>
                        {group.creator?.full_name || 'Unknown'}
                    </Text>
                </View>
            </View>

            <Text style={styles.description}>{group.description}</Text>

            <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <View>
                        <Text style={styles.detailLabel}>Meeting Schedule</Text>
                        <Text style={styles.detailValue}>
                            {formatDateTime(group.meeting_schedule)}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <View>
                        <Text style={styles.detailLabel}>Location</Text>
                        <Text style={styles.detailValue}>{group.meeting_location}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>👥</Text>
                    <View>
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
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
    },
    subject: {
        ...typography.h2,
        color: colors.text.primary,
        flex: 1,
        marginRight: spacing[3],
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[4],
        backgroundColor: colors.background.secondary,
        padding: spacing[3],
        borderRadius: 12,
    },
    creatorInfo: {
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
        marginBottom: spacing[6],
    },
    detailsSection: {
        gap: spacing[3],
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    detailIcon: {
        fontSize: 20,
        marginRight: spacing[3],
        marginTop: 2,
    },
    detailLabel: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginBottom: spacing[1],
    },
    detailValue: {
        ...typography.body,
        color: colors.text.primary,
    },
});
