// useGroupDetails Hook
import { useState, useEffect, useCallback } from 'react';
import * as groupsService from '../services/groups.service';
import * as membersService from '../services/members.service';
import { supabase } from '../services/supabase';
import type { StudyGroupWithDetails } from '../services/groups.service';
import type { GroupMemberWithUser } from '../services/members.service';

interface UseGroupDetailsReturn {
    group: StudyGroupWithDetails | null;
    members: GroupMemberWithUser[];
    loading: boolean;
    error: string | null;
    isMember: boolean;
    isCreator: boolean;
    memberCount: number;
    joinGroup: () => Promise<boolean>;
    leaveGroup: () => Promise<boolean>;
    removeMember: (userId: string) => Promise<boolean>;
    refetch: () => Promise<void>;
    actionLoading: boolean;
}

export const useGroupDetails = (
    groupId: string,
    initialData?: StudyGroupWithDetails
): UseGroupDetailsReturn => {
    const [group, setGroup] = useState<StudyGroupWithDetails | null>(initialData || null);
    const [members, setMembers] = useState<GroupMemberWithUser[]>([]);
    const [loading, setLoading] = useState(!initialData);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMember, setIsMember] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    const fetchGroupDetails = useCallback(async () => {
        // If we have initial data and haven't fetched yet, we might want to just fetch members
        // But for now, let's keep it simple: if initialData is provided, we skip the initial group fetch
        // unless we explicitly call refetch.
        // However, we still need to fetch members and check membership status.

        try {
            if (!initialData || group !== initialData) {
                setLoading(true);
            }
            setError(null);

            const [groupResult, membersResult] = await Promise.all([
                // Only fetch group if we don't have it or if we're refetching
                (!initialData || group !== initialData)
                    ? groupsService.getGroupById(groupId)
                    : Promise.resolve({ success: true, data: initialData } as any),
                membersService.getGroupMembers(groupId),
            ]);

            if (groupResult.success && groupResult.data) {
                setGroup(groupResult.data);

                // Check if current user is creator
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setIsCreator(groupResult.data.creator_id === user.id);
                }
            } else {
                setError(groupResult.message || 'Failed to fetch group');
            }

            if (membersResult.success) {
                setMembers(membersResult.data);

                // Check if current user is member
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const membership = membersResult.data.find((m) => m.user_id === user.id);
                    setIsMember(!!membership);
                }
            }
        } catch (err) {
            setError('Failed to fetch group details');
        } finally {
            setLoading(false);
        }
    }, [groupId, initialData]);

    useEffect(() => {
        // If we have initialData, we can skip the first fetch for the group itself,
        // but we normally still need to check membership/members.
        // For the mock data scenario (User Request), we want to display the data immediately.
        // We will call fetchGroupDetails to get members/auth status, but the group data won't be overwritten if it fails (hopefully).
        fetchGroupDetails();
    }, [groupId, fetchGroupDetails]);

    const joinGroup = useCallback(async (): Promise<boolean> => {
        try {
            setActionLoading(true);
            const result = await membersService.joinGroup(groupId);
            if (result.success) {
                setIsMember(true);
                await fetchGroupDetails();
            }
            return result.success;
        } finally {
            setActionLoading(false);
        }
    }, [groupId, fetchGroupDetails]);

    const leaveGroup = useCallback(async (): Promise<boolean> => {
        try {
            setActionLoading(true);
            const result = await membersService.leaveGroup(groupId);
            if (result.success) {
                setIsMember(false);
                await fetchGroupDetails();
            }
            return result.success;
        } finally {
            setActionLoading(false);
        }
    }, [groupId, fetchGroupDetails]);

    const removeMember = useCallback(async (userId: string): Promise<boolean> => {
        const result = await membersService.removeMember(groupId, userId);
        if (result.success) {
            await fetchGroupDetails();
        }
        return result.success;
    }, [groupId, fetchGroupDetails]);

    return {
        group,
        members,
        loading,
        error,
        isMember,
        isCreator,
        memberCount: members.length > 0 ? members.length : (group?.member_count || 0),
        joinGroup,
        leaveGroup,
        removeMember,
        refetch: fetchGroupDetails,
        actionLoading,
    };
};
