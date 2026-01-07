// Members Service - Group membership operations
import { supabase } from './supabase';
import type { StudyGroupWithDetails, CreatorInfo } from './groups.service';

export interface UserInfo {
    id: string;
    full_name: string;
    profile_photo_url: string | null;
    bio: string | null;
}

export interface GroupMemberWithUser {
    id: string;
    group_id: string;
    user_id: string;
    joined_at: string;
    user: UserInfo | null;
}

export interface UserGroupMembership {
    id: string;
    group_id: string;
    joined_at: string;
    group: StudyGroupWithDetails;
}

export interface MemberResponse {
    success: boolean;
    message: string;
}

export interface MembersListResponse {
    success: boolean;
    message: string;
    data: GroupMemberWithUser[];
}

export interface UserGroupsResponse {
    success: boolean;
    message: string;
    data: UserGroupMembership[];
}

/**
 * Join a study group
 */
export const joinGroup = async (groupId: string): Promise<MemberResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        // Check if already a member
        const { data: existing } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return {
                success: false,
                message: 'You are already a member of this group',
            };
        }

        // Check if group is full
        const { data: group } = await supabase
            .from('study_groups')
            .select('max_capacity, is_full')
            .eq('id', groupId)
            .single();

        if ((group as any)?.is_full) {
            return {
                success: false,
                message: 'This group is full',
            };
        }

        // Get current member count
        const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', groupId);

        const maxCap = (group as any)?.max_capacity;
        if (maxCap && count && count >= maxCap) {
            // Update group to full
            await supabase
                .from('study_groups')
                .update({ is_full: true } as any)
                .eq('id', groupId);

            return {
                success: false,
                message: 'This group is full',
            };
        }

        // Join the group
        const { error } = await supabase
            .from('group_members')
            .insert({
                group_id: groupId,
                user_id: user.id,
            } as any);

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        // Check if group is now full
        const newCount = (count || 0) + 1;
        if (maxCap && newCount >= maxCap) {
            await supabase
                .from('study_groups')
                .update({ is_full: true } as any)
                .eq('id', groupId);
        }

        return {
            success: true,
            message: 'Successfully joined the group',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to join group',
        };
    }
};

/**
 * Leave a study group
 */
export const leaveGroup = async (groupId: string): Promise<MemberResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        // Check if user is the creator
        const { data: group } = await supabase
            .from('study_groups')
            .select('creator_id')
            .eq('id', groupId)
            .single();

        if ((group as any)?.creator_id === user.id) {
            return {
                success: false,
                message: 'Creator cannot leave the group. Delete the group instead.',
            };
        }

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', user.id);

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        // Update is_full status
        await supabase
            .from('study_groups')
            .update({ is_full: false } as any)
            .eq('id', groupId);

        return {
            success: true,
            message: 'Successfully left the group',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to leave group',
        };
    }
};

/**
 * Remove a member from group (creator only)
 */
export const removeMember = async (
    groupId: string,
    userId: string
): Promise<MemberResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        // Check if current user is the creator
        const { data: group } = await supabase
            .from('study_groups')
            .select('creator_id')
            .eq('id', groupId)
            .single();

        const creatorId = (group as any)?.creator_id;
        if (creatorId !== user.id) {
            return {
                success: false,
                message: 'Only the creator can remove members',
            };
        }

        // Cannot remove the creator
        if (userId === creatorId) {
            return {
                success: false,
                message: 'Cannot remove the creator',
            };
        }

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId);

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        // Update is_full status
        await supabase
            .from('study_groups')
            .update({ is_full: false } as any)
            .eq('id', groupId);

        return {
            success: true,
            message: 'Member removed successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to remove member',
        };
    }
};

/**
 * Get all members of a group
 */
export const getGroupMembers = async (groupId: string): Promise<MembersListResponse> => {
    try {
        // Get members
        const { data: members, error } = await supabase
            .from('group_members')
            .select('id, group_id, user_id, joined_at')
            .eq('group_id', groupId)
            .order('joined_at', { ascending: true });

        if (error) {
            return {
                success: false,
                message: error.message,
                data: [],
            };
        }

        // Get user info for each member
        const membersWithUsers = await Promise.all(
            (members || []).map(async (member: any) => {
                const { data: userData } = await supabase
                    .from('users')
                    .select('id, full_name, profile_photo_url, bio')
                    .eq('id', member.user_id)
                    .single();

                return {
                    ...member,
                    user: userData as UserInfo | null,
                } as GroupMemberWithUser;
            })
        );

        return {
            success: true,
            message: 'Members fetched successfully',
            data: membersWithUsers,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch members',
            data: [],
        };
    }
};

/**
 * Get all groups user has joined
 */
export const getUserGroups = async (): Promise<UserGroupsResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
                data: [],
            };
        }

        // Get memberships
        const { data: memberships, error } = await supabase
            .from('group_members')
            .select('id, group_id, joined_at')
            .eq('user_id', user.id)
            .order('joined_at', { ascending: false });

        if (error) {
            return {
                success: false,
                message: error.message,
                data: [],
            };
        }

        // Get group details for each membership
        const membershipsWithGroups = await Promise.all(
            (memberships || []).map(async (membership: any) => {
                // Get group
                const { data: groupData } = await supabase
                    .from('study_groups')
                    .select('*')
                    .eq('id', membership.group_id)
                    .single();

                if (!groupData) {
                    return null;
                }

                // Get creator info
                const { data: creatorData } = await supabase
                    .from('users')
                    .select('id, full_name, profile_photo_url')
                    .eq('id', (groupData as any).creator_id)
                    .single();

                // Get member count
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', membership.group_id);

                return {
                    id: membership.id,
                    group_id: membership.group_id,
                    joined_at: membership.joined_at,
                    group: {
                        ...(groupData as any),
                        creator: creatorData as CreatorInfo | null,
                        member_count: count || 0,
                    },
                } as UserGroupMembership;
            })
        );

        // Filter out nulls
        const validMemberships = membershipsWithGroups.filter(
            (m): m is UserGroupMembership => m !== null
        );

        return {
            success: true,
            message: 'Groups fetched',
            data: validMemberships,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch groups',
            data: [],
        };
    }
};

/**
 * Check if current user is member of group
 */
export const checkMembership = async (groupId: string): Promise<boolean> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return false;

        const { data } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', groupId)
            .eq('user_id', user.id)
            .single();

        return !!data;
    } catch {
        return false;
    }
};

/**
 * Get member count for group
 */
export const getMemberCount = async (groupId: string): Promise<number> => {
    const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

    return count || 0;
};
