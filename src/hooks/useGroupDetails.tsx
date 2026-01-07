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

export const useGroupDetails = (groupId: string): UseGroupDetailsReturn => {
    const [group, setGroup] = useState<StudyGroupWithDetails | null>(null);
    const [members, setMembers] = useState<GroupMemberWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMember, setIsMember] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    const fetchGroupDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [groupResult, membersResult] = await Promise.all([
                groupsService.getGroupById(groupId),
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
                setError(groupResult.message);
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
    }, [groupId]);

    useEffect(() => {
        if (groupId) {
            fetchGroupDetails();
        }
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
        memberCount: members.length,
        joinGroup,
        leaveGroup,
        removeMember,
        refetch: fetchGroupDetails,
        actionLoading,
    };
};
