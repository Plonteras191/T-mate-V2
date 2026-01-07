// ChatHeader Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
                <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>

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
                    <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
                        <Text style={styles.infoIcon}>ℹ️</Text>
                    </TouchableOpacity>
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
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: colors.primary.main,
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: spacing[2],
    },
    groupName: {
        ...typography.h4,
        color: colors.text.primary,
    },
    memberCount: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    infoButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 20,
    },
});
