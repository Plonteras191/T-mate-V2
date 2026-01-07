// useGroups Hook
import { useState, useEffect, useCallback } from 'react';
import * as groupsService from '../services/groups.service';
import * as membersService from '../services/members.service';
import type { StudyGroupWithDetails } from '../services/groups.service';

type FilterType = 'all' | 'open' | 'full';

interface UseGroupsReturn {
    groups: StudyGroupWithDetails[];
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    membershipMap: Record<string, boolean>;
    joinGroup: (groupId: string) => Promise<boolean>;
    joiningGroupId: string | null;
}

export const useGroups = (): UseGroupsReturn => {
    const [groups, setGroups] = useState<StudyGroupWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [membershipMap, setMembershipMap] = useState<Record<string, boolean>>({});
    const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

    const fetchGroups = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
                setPage(0);
            } else {
                setLoading(true);
            }
            setError(null);

            let result;
            if (searchQuery.trim()) {
                result = await groupsService.searchGroups(searchQuery);
            } else {
                result = await groupsService.getAllGroups(0, {
                    availability: filter === 'all' ? undefined : filter,
                });
            }

            if (result.success) {
                setGroups(result.data);
                setHasMore(result.hasMore);

                // Check membership for each group
                const memberships: Record<string, boolean> = {};
                for (const group of result.data) {
                    memberships[group.id] = await membersService.checkMembership(group.id);
                }
                setMembershipMap(memberships);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to fetch groups');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [searchQuery, filter]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return;

        try {
            const nextPage = page + 1;
            const result = await groupsService.getAllGroups(nextPage, {
                availability: filter === 'all' ? undefined : filter,
            });

            if (result.success) {
                setGroups((prev) => [...prev, ...result.data]);
                setHasMore(result.hasMore);
                setPage(nextPage);

                // Check membership for new groups
                const newMemberships: Record<string, boolean> = { ...membershipMap };
                for (const group of result.data) {
                    newMemberships[group.id] = await membersService.checkMembership(group.id);
                }
                setMembershipMap(newMemberships);
            }
        } catch (err) {
            console.error('Error loading more groups:', err);
        }
    }, [hasMore, loading, page, filter, membershipMap]);

    const joinGroup = useCallback(async (groupId: string): Promise<boolean> => {
        try {
            setJoiningGroupId(groupId);
            const result = await membersService.joinGroup(groupId);
            if (result.success) {
                setMembershipMap((prev) => ({ ...prev, [groupId]: true }));
            }
            return result.success;
        } finally {
            setJoiningGroupId(null);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    return {
        groups,
        loading,
        refreshing,
        error,
        refetch: () => fetchGroups(true),
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        hasMore,
        loadMore,
        membershipMap,
        joinGroup,
        joiningGroupId,
    };
};
