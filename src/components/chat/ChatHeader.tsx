// ChatHeader Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '../common/IconButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ChatHeaderProps {
    groupName: string;
    memberCount: number;
    onBackPress: () => void;
    onInfoPress?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    groupName,
    memberCount,
    onBackPress,
    onInfoPress,
}) => {
    return (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
            <View style={styles.container}>
                {/* Back button */}
                <IconButton
                    icon="arrow-left"
                    onPress={onBackPress}
                    variant="ghost"
                />

                {/* Group info */}
                <View style={styles.titleContainer}>
                    <Text style={styles.groupName} numberOfLines={1}>
                        {groupName}
                    </Text>
                    {memberCount > 0 && (
                        <Text style={styles.memberCount}>
                            {memberCount} {memberCount === 1 ? 'member' : 'members'}
                        </Text>
                    )}
                </View>

                {/* Info button (optional) */}
                {onInfoPress && (
                    <IconButton
                        icon="info"
                        onPress={onInfoPress}
                        variant="ghost"
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        minHeight: 56,
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: spacing[2],
    },
    groupName: {
        ...typography.h4,
        color: colors.text.primary,
        fontSize: 16,
    },
    memberCount: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginTop: 0,
        fontSize: 12,
    },
});
