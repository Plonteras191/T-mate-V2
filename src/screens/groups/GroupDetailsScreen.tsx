// GroupDetailsScreen
import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, LoadingSpinner, IconButton } from '../../components/common';
import { GroupHeader } from '../../components/groups';
import { useGroupDetails } from '../../hooks/useGroupDetails';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Feather } from '@expo/vector-icons';
import type { GroupsScreenProps } from '../../types/navigation.types';

export const GroupDetailsScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<GroupsScreenProps<'GroupDetails'>['route']>();
    const { groupId, initialData } = route.params;
    const insets = useSafeAreaInsets();

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
            Alert.alert('Welcome!', 'You have successfully joined the group.');
        } else {
            Alert.alert('Error', 'Failed to join group');
        }
    };

    const handleLeave = () => {
        Alert.alert(
            'Leave Group',
            'Are you sure you want to leave this group? You can always join again later if there is space.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave Group',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await leaveGroup();
                        if (success) {
                            // Optional: navigate back or show toast
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

    const handleChat = () => {
        if (group) {
            navigation.navigate('GroupChat', {
                groupId,
                groupName: group.subject
            });
        }
    };

    if (loading || !group) {
        return <LoadingSpinner fullScreen message="Loading details..." />;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Absolute Header for Back/Edit buttons */}
            <View style={[styles.headerBar, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                >
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>

                {isCreator && (
                    <TouchableOpacity
                        onPress={handleEdit}
                        style={styles.iconButton}
                    >
                        <Feather name="edit-2" size={20} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingBottom: insets.bottom + 100 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <GroupHeader group={group} onCreatorPress={handleViewCreator} />

                {/* Members Preview Section */}
                <View style={styles.sectionContainer}>
                    <TouchableOpacity
                        style={styles.membersCard}
                        onPress={handleViewMembers}
                        activeOpacity={0.7}
                    >
                        <View style={styles.membersHeader}>
                            <Text style={styles.sectionTitle}>Members</Text>
                            <View style={styles.seeAllContainer}>
                                <Text style={styles.seeAllText}>See all</Text>
                                <Feather name="chevron-right" size={16} color={colors.primary.main} />
                            </View>
                        </View>

                        <View style={styles.membersPreview}>
                            <View style={styles.membersAvatars}>
                                {/* Using placeholder circles or icons since we don't have member list in this hook yet */}
                                {[1, 2, 3].map((_, i) => (
                                    <View key={i} style={[styles.avatarPlaceholder, { zIndex: 3 - i, marginLeft: i === 0 ? 0 : -10 }]}>
                                        <Feather name="user" size={16} color={colors.primary.main} />
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.membersCountText}>
                                {memberCount} {memberCount === 1 ? 'member' : 'members'} joined
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Additional info or CTA area if needed */}

            </ScrollView>

            {/* Floating Action Bar */}
            <View style={[styles.floatingActionBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing[4] }]}>
                {isMember ? (
                    <View style={styles.memberActions}>
                        <Button
                            title="Open Chat"
                            onPress={handleChat}
                            variant="primary"
                            icon={<Feather name="message-circle" size={20} color="#FFF" />}
                            style={{ flex: 1 }}
                        />
                        {!isCreator && (
                            <TouchableOpacity
                                style={styles.leaveButton}
                                onPress={handleLeave}
                                disabled={actionLoading}
                            >
                                <Feather name="log-out" size={20} color={colors.danger.main} />
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <Button
                        title={group.is_full ? "Group Full" : "Join Group"}
                        onPress={handleJoin}
                        loading={actionLoading}
                        disabled={group.is_full}
                        variant={group.is_full ? "outline" : "primary"}
                        fullWidth
                        icon={!group.is_full ? <Feather name="user-plus" size={20} color="#FFF" /> : undefined}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.tertiary, // use slightly darker bg for contrast with white cards
    },
    headerBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[4],
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 0,
    },
    sectionContainer: {
        paddingHorizontal: spacing[4],
        marginBottom: spacing[4],
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.text.primary,
        fontSize: 18,
    },
    membersCard: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        ...shadows.sm,
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    membersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[3],
    },
    seeAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '600',
        marginRight: 2,
    },
    membersPreview: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    membersAvatars: {
        flexDirection: 'row',
        marginRight: spacing[3],
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary.light + '20', // transparent indigo
        borderWidth: 2,
        borderColor: colors.surface.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    membersCountText: {
        ...typography.body,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    floatingActionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.surface.primary,
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        ...shadows.lg,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    memberActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    leaveButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: colors.danger.light + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
