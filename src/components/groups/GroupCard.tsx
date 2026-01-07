// GroupCard Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatDateTime, truncateText, formatMemberCount } from '../../utils/formatters';
import type { StudyGroupWithDetails } from '../../services/groups.service';

interface GroupCardProps {
    group: StudyGroupWithDetails;
    onPress: () => void;
    showJoinButton?: boolean;
    onJoinPress?: () => void;
    isMember?: boolean;
    isLoading?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
    group,
    onPress,
    showJoinButton = false,
    onJoinPress,
    isMember = false,
    isLoading = false,
}) => {
    return (
        <Card onPress={onPress} style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.subject} numberOfLines={1}>
                        {group.subject}
                    </Text>
                    <Badge
                        label={group.is_full ? 'Full' : 'Open'}
                        variant={group.is_full ? 'danger' : 'success'}
                        size="small"
                    />
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {truncateText(group.description, 100)}
                </Text>
            </View>

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Feather name="calendar" size={14} color={colors.text.secondary} />
                    <Text style={styles.detailText}>
                        {formatDateTime(group.meeting_schedule)}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Feather name="map-pin" size={14} color={colors.text.secondary} />
                    <Text style={styles.detailText} numberOfLines={1}>
                        {group.meeting_location}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.creatorInfo}>
                    <Avatar
                        uri={group.creator?.profile_photo_url}
                        name={group.creator?.full_name || 'Unknown'}
                        size="small"
                    />
                    <Text style={styles.creatorName} numberOfLines={1}>
                        {group.creator?.full_name || 'Unknown'}
                    </Text>
                </View>

                <View style={styles.memberInfo}>
                    <Feather name="users" size={14} color={colors.text.tertiary} style={{ marginRight: 4 }} />
                    <Text style={styles.memberCount}>
                        {formatMemberCount(group.member_count, group.max_capacity)}
                    </Text>
                </View>
            </View>

            {showJoinButton && !isMember && !group.is_full && (
                <Button
                    title="Join Group"
                    onPress={onJoinPress || (() => { })}
                    variant="primary"
                    size="medium"
                    loading={isLoading}
                    fullWidth
                    style={styles.joinButton}
                />
            )}

            {isMember && (
                <View style={styles.memberBadge}>
                    <Feather name="check" size={14} color={colors.success.main} style={{ marginRight: 4 }} />
                    <Text style={styles.memberBadgeText}>Joined</Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing[3],
        borderRadius: borderRadius.lg,
    },
    header: {
        marginBottom: spacing[3],
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[1],
    },
    subject: {
        ...typography.h4,
        color: colors.text.primary,
        flex: 1,
        marginRight: spacing[2],
    },
    description: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        marginTop: spacing[1],
    },
    details: {
        marginBottom: spacing[3],
        gap: spacing[1],
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    detailText: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing[3],
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    creatorName: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        marginLeft: spacing[2],
        flex: 1,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        paddingHorizontal: spacing[2],
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    memberCount: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    joinButton: {
        marginTop: spacing[3],
    },
    memberBadge: {
        marginTop: spacing[3],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.success.light + '20',
        paddingVertical: spacing[2],
        borderRadius: borderRadius.md,
    },
    memberBadgeText: {
        ...typography.bodySmall,
        color: colors.success.main,
        fontWeight: '600',
    },
});
