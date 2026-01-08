// GroupList Component
import React from 'react';
import {
    FlatList,
    StyleSheet,
    RefreshControl,
    View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GroupCard } from './GroupCard';
import { EmptyState, LoadingSpinner } from '../common';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StudyGroupWithDetails } from '../../services/groups.service';

interface GroupListProps {
    groups: StudyGroupWithDetails[];
    loading: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    onGroupPress: (group: StudyGroupWithDetails) => void;
    onJoinPress?: (group: StudyGroupWithDetails) => void;
    showJoinButton?: boolean;
    membershipMap?: Record<string, boolean>;
    joiningGroupId?: string | null;
    emptyIcon?: keyof typeof Feather.glyphMap;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActionLabel?: string;
    onEmptyAction?: () => void;
    onEndReached?: () => void;
    hasMore?: boolean;
    ListHeaderComponent?: React.ReactElement;
}

export const GroupList: React.FC<GroupListProps> = ({
    groups,
    loading,
    refreshing = false,
    onRefresh,
    onGroupPress,
    onJoinPress,
    showJoinButton = false,
    membershipMap = {},
    joiningGroupId,
    emptyIcon = 'book-open',
    emptyTitle = 'No groups found',
    emptyDescription = 'Be the first to create a study group!',
    emptyActionLabel,
    onEmptyAction,
    onEndReached,
    hasMore = false,
    ListHeaderComponent,
}) => {
    if (loading && groups.length === 0) {
        return <LoadingSpinner fullScreen message="Loading groups..." />;
    }

    const renderItem = ({ item }: { item: StudyGroupWithDetails }) => (
        <GroupCard
            group={item}
            onPress={() => onGroupPress(item)}
            showJoinButton={showJoinButton}
            onJoinPress={() => onJoinPress?.(item)}
            isMember={membershipMap[item.id]}
            isLoading={joiningGroupId === item.id}
        />
    );

    const renderEmpty = () => (
        <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
        />
    );

    const renderFooter = () => {
        if (!hasMore) return null;
        return (
            <View style={styles.footer}>
                <LoadingSpinner size="small" message="Loading more..." />
            </View>
        );
    };

    return (
        <FlatList
            data={groups}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
                styles.container,
                groups.length === 0 && styles.emptyContainer,
            ]}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={!loading ? renderEmpty : null}
            ListFooterComponent={renderFooter}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary.main]}
                        tintColor={colors.primary.main}
                    />
                ) : undefined
            }
            onEndReached={hasMore ? onEndReached : undefined}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing[4],
    },
    emptyContainer: {
        flex: 1,
    },
    footer: {
        paddingVertical: spacing[4],
    },
});
