// useSearch Hook
import { useState, useCallback, useEffect, useRef } from 'react';
import * as groupsService from '../services/groups.service';
import type { StudyGroupWithDetails } from '../services/groups.service';

interface UseSearchReturn {
    query: string;
    setQuery: (query: string) => void;
    results: StudyGroupWithDetails[];
    loading: boolean;
    error: string | null;
    clear: () => void;
}

export const useSearch = (debounceMs: number = 300): UseSearchReturn => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<StudyGroupWithDetails[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const result = await groupsService.searchGroups(searchQuery);
            if (result.success) {
                setResults(result.data);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            search(query);
        }, debounceMs);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query, debounceMs, search]);

    const clear = useCallback(() => {
        setQuery('');
        setResults([]);
        setError(null);
    }, []);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        clear,
    };
};
