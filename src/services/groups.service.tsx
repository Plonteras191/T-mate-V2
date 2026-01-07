// Groups Service - CRUD operations for study groups
import { supabase } from './supabase';
import type { StudyGroup } from '../types/database.types';

export interface CreateGroupInput {
    subject: string;
    description: string;
    meeting_schedule: string;
    meeting_location: string;
    max_capacity?: number;
}

export interface UpdateGroupInput {
    subject?: string;
    description?: string;
    meeting_schedule?: string;
    meeting_location?: string;
    max_capacity?: number;
}

export interface GroupFilters {
    availability?: 'open' | 'full' | 'all';
    dateFrom?: string;
    dateTo?: string;
}

export interface CreatorInfo {
    id: string;
    full_name: string;
    profile_photo_url: string | null;
}

export interface StudyGroupWithDetails extends StudyGroup {
    creator: CreatorInfo | null;
    member_count: number;
}

export interface GroupResponse {
    success: boolean;
    message: string;
    data?: StudyGroupWithDetails | null;
}

export interface GroupsListResponse {
    success: boolean;
    message: string;
    data: StudyGroupWithDetails[];
    hasMore: boolean;
}

const PAGE_SIZE = 10;

/**
 * Get all study groups with creator info and member count
 */
export const getAllGroups = async (
    page: number = 0,
    filters?: GroupFilters
): Promise<GroupsListResponse> => {
    try {
        let query = supabase
            .from('study_groups')
            .select('*')
            .order('created_at', { ascending: false })
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        // Apply filters
        if (filters?.availability === 'open') {
            query = query.eq('is_full', false);
        } else if (filters?.availability === 'full') {
            query = query.eq('is_full', true);
        }

        if (filters?.dateFrom) {
            query = query.gte('meeting_schedule', filters.dateFrom);
        }

        if (filters?.dateTo) {
            query = query.lte('meeting_schedule', filters.dateTo);
        }

        const { data, error } = await query;

        if (error) {
            return {
                success: false,
                message: error.message,
                data: [],
                hasMore: false,
            };
        }

        // Get member counts and creator info for each group
        const groupsWithDetails = await Promise.all(
            (data || []).map(async (group: any) => {
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', group.id);

                // Get creator info
                const { data: creatorData } = await supabase
                    .from('users')
                    .select('id, full_name, profile_photo_url')
                    .eq('id', group.creator_id)
                    .single();

                return {
                    ...group,
                    creator: creatorData as CreatorInfo | null,
                    member_count: count || 0,
                } as StudyGroupWithDetails;
            })
        );

        return {
            success: true,
            message: 'Groups fetched successfully',
            data: groupsWithDetails,
            hasMore: (data?.length || 0) === PAGE_SIZE,
        };
    } catch (error) {
        console.error('Error in getAllGroups:', error);
        return {
            success: false,
            message: 'Failed to fetch groups',
            data: [],
            hasMore: false,
        };
    }
};

/**
 * Get single group by ID with full details
 */
export const getGroupById = async (groupId: string): Promise<GroupResponse> => {
    try {
        const { data, error } = await supabase
            .from('study_groups')
            .select('*')
            .eq('id', groupId)
            .single();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        // Get member count
        const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', groupId);

        // Get creator info
        const { data: creatorData } = await supabase
            .from('users')
            .select('id, full_name, profile_photo_url')
            .eq('id', (data as any).creator_id)
            .single();

        return {
            success: true,
            message: 'Group fetched successfully',
            data: {
                ...(data as any),
                creator: creatorData as CreatorInfo | null,
                member_count: count || 0,
            } as StudyGroupWithDetails,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch group',
        };
    }
};

/**
 * Create new study group
 */
export const createGroup = async (input: CreateGroupInput): Promise<GroupResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        const { data, error } = await supabase
            .from('study_groups')
            .insert({
                creator_id: user.id,
                subject: input.subject,
                description: input.description,
                meeting_schedule: input.meeting_schedule,
                meeting_location: input.meeting_location,
                max_capacity: input.max_capacity || null,
            } as any)
            .select('*')
            .single();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        // Auto-join the creator as a member
        await supabase
            .from('group_members')
            .insert({
                group_id: (data as any).id,
                user_id: user.id,
            } as any);

        // Get creator info
        const { data: creatorData } = await supabase
            .from('users')
            .select('id, full_name, profile_photo_url')
            .eq('id', user.id)
            .single();

        return {
            success: true,
            message: 'Group created successfully',
            data: {
                ...(data as any),
                creator: creatorData as CreatorInfo | null,
                member_count: 1,
            } as StudyGroupWithDetails,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create group',
        };
    }
};

/**
 * Update existing group
 */
export const updateGroup = async (
    groupId: string,
    input: UpdateGroupInput
): Promise<GroupResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        // Check if user is creator
        const { data: group } = await supabase
            .from('study_groups')
            .select('creator_id')
            .eq('id', groupId)
            .single();

        if ((group as any)?.creator_id !== user.id) {
            return {
                success: false,
                message: 'Only the creator can edit this group',
            };
        }

        const updateData: Record<string, any> = {
            ...input,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('study_groups')
            .update(updateData)
            .eq('id', groupId)
            .select('*')
            .single();

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', groupId);

        // Get creator info
        const { data: creatorData } = await supabase
            .from('users')
            .select('id, full_name, profile_photo_url')
            .eq('id', user.id)
            .single();

        return {
            success: true,
            message: 'Group updated successfully',
            data: {
                ...(data as any),
                creator: creatorData as CreatorInfo | null,
                member_count: count || 0,
            } as StudyGroupWithDetails,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to update group',
        };
    }
};

/**
 * Delete group (creator only)
 */
export const deleteGroup = async (groupId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
            };
        }

        const { error } = await supabase
            .from('study_groups')
            .delete()
            .eq('id', groupId)
            .eq('creator_id', user.id);

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Group deleted successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to delete group',
        };
    }
};

/**
 * Search groups by subject
 */
export const searchGroups = async (query: string): Promise<GroupsListResponse> => {
    try {
        const { data, error } = await supabase
            .from('study_groups')
            .select('*')
            .ilike('subject', `%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            return {
                success: false,
                message: error.message,
                data: [],
                hasMore: false,
            };
        }

        const groupsWithDetails = await Promise.all(
            (data || []).map(async (group: any) => {
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', group.id);

                const { data: creatorData } = await supabase
                    .from('users')
                    .select('id, full_name, profile_photo_url')
                    .eq('id', group.creator_id)
                    .single();

                return {
                    ...group,
                    creator: creatorData as CreatorInfo | null,
                    member_count: count || 0,
                } as StudyGroupWithDetails;
            })
        );

        return {
            success: true,
            message: 'Search completed',
            data: groupsWithDetails,
            hasMore: false,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Search failed',
            data: [],
            hasMore: false,
        };
    }
};

/**
 * Get groups created by current user
 */
export const getMyCreatedGroups = async (): Promise<GroupsListResponse> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: 'Not authenticated',
                data: [],
                hasMore: false,
            };
        }

        const { data, error } = await supabase
            .from('study_groups')
            .select('*')
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return {
                success: false,
                message: error.message,
                data: [],
                hasMore: false,
            };
        }

        const groupsWithDetails = await Promise.all(
            (data || []).map(async (group: any) => {
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', group.id);

                const { data: creatorData } = await supabase
                    .from('users')
                    .select('id, full_name, profile_photo_url')
                    .eq('id', group.creator_id)
                    .single();

                return {
                    ...group,
                    creator: creatorData as CreatorInfo | null,
                    member_count: count || 0,
                } as StudyGroupWithDetails;
            })
        );

        return {
            success: true,
            message: 'Groups fetched',
            data: groupsWithDetails,
            hasMore: false,
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch groups',
            data: [],
            hasMore: false,
        };
    }
};

/**
 * Check if current user is member of group
 */
export const checkIfMember = async (groupId: string): Promise<boolean> => {
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
 * Get member count for a group
 */
export const getGroupMemberCount = async (groupId: string): Promise<number> => {
    const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

    return count || 0;
};
