// GroupDetailsScreen
import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, LoadingSpinner, IconButton, Divider } from '../../components/common';
import { GroupHeader } from '../../components/groups';
import { useGroupDetails } from '../../hooks/useGroupDetails';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { GroupsScreenProps } from '../../types/navigation.types';

export const GroupDetailsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<GroupsScreenProps<'GroupDetails'>['route']>();
    const { groupId } = route.params;

    const {
        group,
        loading,
        isMember,
        isCreator,
        memberCount,
        joinGroup,
        leaveGroup,
        actionLoading,
    } = useGroupDetails(groupId);

    const handleJoin = async () => {
        const success = await joinGroup();
        if (success) {
            Alert.alert('Success', 'You have joined the group!');
        } else {
            Alert.alert('Error', 'Failed to join group');
        }
    };

    const handleLeave = () => {
        Alert.alert(
            'Leave Group',
            'Are you sure you want to leave this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await leaveGroup();
                        if (success) {
                            Alert.alert('Success', 'You have left the group');
                        } else {
                            Alert.alert('Error', 'Failed to leave group');
                        }
                    },
                },
            ]
        );
    };

    const handleViewMembers = () => {
        navigation.navigate('GroupMembers', { groupId, isCreator });
    };

    const handleEdit = () => {
        navigation.navigate('EditGroup', { groupId });
    };

    const handleViewCreator = () => {
        if (group?.creator?.id) {
            navigation.navigate('ViewUserProfile', { userId: group.creator.id });
        }
    };

    if (loading || !group) {
        return <LoadingSpinner fullScreen message="Loading group..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header Bar */}
                <View style={styles.headerBar}>
                    <IconButton
                        icon="←"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                    />
                    {isCreator && (
                        <IconButton
                            icon="✏️"
                            onPress={handleEdit}
                            variant="ghost"
                        />
                    )}
                </View>

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <GroupHeader group={group} onCreatorPress={handleViewCreator} />

                    <Divider style={styles.divider} />

                    {/* Members Section */}
                    <View style={styles.membersSection}>
                        <Button
                            title={`View Members (${memberCount})`}
                            onPress={handleViewMembers}
                            variant="outline"
                            fullWidth
                        />
                    </View>
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    {!isMember && !group.is_full && (
                        <Button
                            title="Join Group"
                            onPress={handleJoin}
                            loading={actionLoading}
                            fullWidth
                        />
                    )}
                    {!isMember && group.is_full && (
                        <Button
                            title="Group is Full"
                            onPress={() => { }}
                            disabled
                            fullWidth
                        />
                    )}
                    {isMember && !isCreator && (
                        <Button
                            title="Leave Group"
                            onPress={handleLeave}
                            loading={actionLoading}
                            variant="danger"
                            fullWidth
                        />
                    )}
                    {isCreator && (
                        <Button
                            title="Edit Group"
                            onPress={handleEdit}
                            variant="secondary"
                            fullWidth
                        />
                    )}
                </View>
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
    headerBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: spacing[4],
    },
    divider: {
        marginHorizontal: spacing[4],
    },
    membersSection: {
        padding: spacing[4],
    },
    actions: {
        padding: spacing[4],
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        backgroundColor: colors.surface.primary,
    },
});
