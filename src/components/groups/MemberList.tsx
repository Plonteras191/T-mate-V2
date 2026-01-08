// MemberList Component
import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { MemberItem } from './MemberItem';
import { EmptyState, LoadingSpinner, Divider } from '../common';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { GroupMemberWithUser } from '../../services/members.service';

interface MemberListProps {
    members: GroupMemberWithUser[];
    creatorId: string;
    loading: boolean;
    canRemove?: boolean;
    onMemberPress?: (member: GroupMemberWithUser) => void;
    onRemoveMember?: (member: GroupMemberWithUser) => void;
    removingMemberId?: string | null;
}

export const MemberList: React.FC<MemberListProps> = ({
    members,
    creatorId,
    loading,
    canRemove = false,
    onMemberPress,
    onRemoveMember,
    removingMemberId,
}) => {
    if (loading) {
        return <LoadingSpinner fullScreen message="Loading members..." />;
    }

    const renderItem = ({ item }: { item: GroupMemberWithUser }) => (
        <MemberItem
            member={item}
            isCreator={item.user_id === creatorId}
            canRemove={canRemove}
            onPress={() => onMemberPress?.(item)}
            onRemove={() => onRemoveMember?.(item)}
            isRemoving={removingMemberId === item.user_id}
        />
    );

    const renderSeparator = () => <Divider />;

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerText}>
                {members.length} {members.length === 1 ? 'Member' : 'Members'}
            </Text>
        </View>
    );

    const renderEmpty = () => (
        <EmptyState
            icon="users"
            title="No Members Yet"
            description="This group doesn't have any members yet."
        />
    );

    return (
        <FlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    header: {
        padding: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    headerText: {
        ...typography.label,
        color: colors.text.secondary,
    },
});
