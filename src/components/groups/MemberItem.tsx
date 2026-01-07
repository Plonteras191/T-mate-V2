// MemberItem Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { IconButton } from '../common/IconButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
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
                        <Badge label="Creator" variant="primary" size="small" />
                    )}
                </View>
                <Text style={styles.joinedAt}>
                    Joined {formatRelativeTime(member.joined_at)}
                </Text>
            </View>

            {canRemove && !isCreator && onRemove && (
                <IconButton
                    icon="✕"
                    onPress={onRemove}
                    variant="ghost"
                    size="small"
                    loading={isRemoving}
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
    },
    info: {
        flex: 1,
        marginLeft: spacing[3],
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    name: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
    },
    joinedAt: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginTop: spacing[1],
    },
});
