// MemberItem Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Avatar } from '../common/Avatar';
import { IconButton } from '../common/IconButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatRelativeTime } from '../../utils/formatters';
import type { GroupMemberWithUser } from '../../services/members.service';

interface MemberItemProps {
    member: GroupMemberWithUser;
    isCreator?: boolean;
    canRemove?: boolean;
    onPress?: () => void;
    onRemove?: () => void;
    isRemoving?: boolean;
}

export const MemberItem: React.FC<MemberItemProps> = ({
    member,
    isCreator = false,
    canRemove = false,
    onPress,
    onRemove,
    isRemoving = false,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress}
        >
            <Avatar
                uri={member.user?.profile_photo_url}
                name={member.user?.full_name || 'Unknown'}
                size="medium"
            />

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {member.user?.full_name || 'Unknown'}
                    </Text>
                    {isCreator && (
                        <View style={styles.creatorBadge}>
                            <Feather name="star" size={10} color={colors.warning.main} />
                            <Text style={styles.creatorText}>Admin</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.joinedAt}>
                    Joined {formatRelativeTime(member.joined_at)}
                </Text>
            </View>

            {canRemove && !isCreator && onRemove && (
                <IconButton
                    icon="x"
                    onPress={onRemove}
                    variant="ghost"
                    size="small"
                    loading={isRemoving}
                    style={styles.removeButton}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        backgroundColor: colors.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    info: {
        flex: 1,
        marginLeft: spacing[3],
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: 2,
    },
    name: {
        ...typography.body,
        fontSize: 15,
        color: colors.text.primary,
        fontWeight: '600',
    },
    creatorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warning.light + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    creatorText: {
        ...typography.caption,
        color: colors.warning.main,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    joinedAt: {
        ...typography.caption,
        color: colors.text.tertiary,
    },
    removeButton: {
        marginLeft: spacing[2],
    },
});
