// GroupDetailsScreen
import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, LoadingSpinner, IconButton, Divider } from '../../components/common';
import { GroupHeader } from '../../components/groups';
import { useGroupDetails } from '../../hooks/useGroupDetails';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Feather } from '@expo/vector-icons';
import type { GroupsScreenProps } from '../../types/navigation.types';

export const GroupDetailsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<GroupsScreenProps<'GroupDetails'>['route']>();
    const { groupId, initialData } = route.params;

    const {
        group,
        loading,
        isMember,
        isCreator,
        memberCount,
        joinGroup,
        leaveGroup,
        actionLoading,
    } = useGroupDetails(groupId, initialData);

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
                        icon="arrow-left"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                    />
                    {isCreator && (
                        <IconButton
                            icon="edit-2"
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

                    {/* Open Chat Button */}
                    {isMember && (
                        <View style={styles.chatSection}>
                            <Button
                                title="Open Chat"
                                onPress={() => navigation.navigate('GroupChat', {
                                    groupId,
                                    groupName: group.subject
                                })}
                                variant="primary"
                                fullWidth
                            />
                        </View>
                    )}

                    {/* Members Section */}
                    <TouchableOpacity
                        style={styles.membersRow}
                        onPress={handleViewMembers}
                        activeOpacity={0.7}
                    >
                        <View style={styles.membersIconContainer}>
                            <Feather name="users" size={20} color={colors.primary.main} />
                        </View>
                        <Text style={styles.membersLabel}>View Members</Text>
                        <View style={styles.membersBadge}>
                            <Text style={styles.membersBadgeText}>{memberCount}</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={colors.text.tertiary} />
                    </TouchableOpacity>
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
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[3],
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: spacing[6],
    },
    divider: {
        marginHorizontal: spacing[4],
        marginVertical: spacing[2],
    },
    chatSection: {
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
    },
    membersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing[4],
        marginTop: spacing[3],
        padding: spacing[4],
        backgroundColor: colors.surface.secondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    membersIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary.light + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing[3],
    },
    membersLabel: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
        flex: 1,
    },
    membersBadge: {
        backgroundColor: colors.primary.main,
        paddingHorizontal: spacing[3],
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        marginRight: spacing[2],
    },
    membersBadgeText: {
        ...typography.caption,
        color: colors.text.inverse,
        fontWeight: '600',
    },
    actions: {
        padding: spacing[4],
        paddingTop: spacing[5],
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        backgroundColor: colors.surface.primary,
        gap: spacing[3],
    },
});
