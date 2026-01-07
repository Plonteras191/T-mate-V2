// useMyGroups Hook
import { useState, useEffect, useCallback } from 'react';
import * as groupsService from '../services/groups.service';
import * as membersService from '../services/members.service';
import type { StudyGroupWithDetails } from '../services/groups.service';
import type { UserGroupMembership } from '../services/members.service';

interface UseMyGroupsReturn {
    joinedGroups: UserGroupMembership[];
    createdGroups: StudyGroupWithDetails[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useMyGroups = (): UseMyGroupsReturn => {
    const [joinedGroups, setJoinedGroups] = useState<UserGroupMembership[]>([]);
    const [createdGroups, setCreatedGroups] = useState<StudyGroupWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyGroups = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [joinedResult, createdResult] = await Promise.all([
                membersService.getUserGroups(),
                groupsService.getMyCreatedGroups(),
            ]);

            if (joinedResult.success) {
                setJoinedGroups(joinedResult.data);
            }

            if (createdResult.success) {
                setCreatedGroups(createdResult.data);
            }

            if (!joinedResult.success && !createdResult.success) {
                setError('Failed to fetch groups');
            }
        } catch (err) {
            setError('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyGroups();
    }, [fetchMyGroups]);

    return {
        joinedGroups,
        createdGroups,
        loading,
        error,
        refetch: fetchMyGroups,
    };
};
