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
                    {group.is_full ? (
                        <Badge label="Full" variant="danger" size="small" />
                    ) : (
                        <View style={styles.openBadge}>
                            <View style={styles.openIndicator} />
                            <Text style={styles.openText}>Open</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {truncateText(group.description, 100)}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Feather name="calendar" size={14} color={colors.primary.main} />
                    <Text style={styles.detailText}>
                        {formatDateTime(group.meeting_schedule)}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Feather name="map-pin" size={14} color={colors.primary.main} />
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
                    <Feather name="users" size={12} color={colors.text.secondary} style={{ marginRight: 4 }} />
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
                    <Feather name="check-circle" size={16} color={colors.success.main} style={{ marginRight: 6 }} />
                    <Text style={styles.memberBadgeText}>Member</Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing[3],
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border.light,
        padding: spacing[4],
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
        fontWeight: '700',
    },
    openBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success.light + '20',
        paddingHorizontal: spacing[2],
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    openIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success.main,
        marginRight: 6,
    },
    openText: {
        ...typography.caption,
        color: colors.success.main,
        fontWeight: '600',
    },
    description: {
        ...typography.bodySmall,
        color: colors.text.secondary,
        marginTop: spacing[1],
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.light,
        opacity: 0.5,
        marginBottom: spacing[3],
    },
    details: {
        marginBottom: spacing[3],
        gap: spacing[2],
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    detailText: {
        ...typography.caption,
        color: colors.text.secondary,
        flex: 1,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    creatorName: {
        ...typography.caption,
        color: colors.text.primary,
        marginLeft: spacing[2],
        flex: 1,
        fontWeight: '500',
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        paddingHorizontal: spacing[3],
        paddingVertical: 4,
        borderRadius: borderRadius.md,
    },
    memberCount: {
        ...typography.caption,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    joinButton: {
        marginTop: spacing[4],
    },
    memberBadge: {
        marginTop: spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.success.light + '15',
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        borderRadius: borderRadius.lg,
        alignSelf: 'flex-start',
    },
    memberBadgeText: {
        ...typography.bodySmall,
        color: colors.success.main,
        fontWeight: '600',
    },
});
