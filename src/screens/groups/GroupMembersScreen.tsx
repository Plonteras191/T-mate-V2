// GroupMembersScreen
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconButton } from '../../components/common';
import { MemberList } from '../../components/groups';
import { useGroupDetails } from '../../hooks/useGroupDetails';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { GroupsScreenProps } from '../../types/navigation.types';
import type { GroupMemberWithUser } from '../../services/members.service';

export const GroupMembersScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<GroupsScreenProps<'GroupMembers'>['route']>();
    const { groupId, isCreator } = route.params;

    const { group, members, loading, removeMember, refetch } = useGroupDetails(groupId);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

    const handleMemberPress = (member: GroupMemberWithUser) => {
        navigation.navigate('ViewUserProfile', { userId: member.user_id });
    };

    const handleRemoveMember = (member: GroupMemberWithUser) => {
        Alert.alert(
            'Remove Member',
            `Are you sure you want to remove ${member.user?.full_name || 'this member'} from the group?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        setRemovingMemberId(member.user_id);
                        const success = await removeMember(member.user_id);
                        setRemovingMemberId(null);
                        if (success) {
                            Alert.alert('Success', 'Member removed');
                            refetch();
                        } else {
                            Alert.alert('Error', 'Failed to remove member');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <IconButton
                        icon="arrow-left"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                    />
                </View>

                {/* Members List */}
                <MemberList
                    members={members}
                    creatorId={group?.creator_id || ''}
                    loading={loading}
                    canRemove={isCreator}
                    onMemberPress={handleMemberPress}
                    onRemoveMember={handleRemoveMember}
                    removingMemberId={removingMemberId}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
});
