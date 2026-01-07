// ProfileHeader Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../common/Avatar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { User } from '../../types/database.types';

interface ProfileHeaderProps {
    user: User;
    showEmail?: boolean;
    onAvatarPress?: () => void;
    showEditButton?: boolean;
    onEditPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    showEmail = true,
    onAvatarPress,
    showEditButton = false,
    onEditPress,
}) => {
    return (
        <View style={styles.container}>
            <Avatar
                uri={user.profile_photo_url}
                name={user.full_name}
                size="xlarge"
                onPress={onAvatarPress}
                showEditButton={showEditButton}
                onEditPress={onEditPress}
            />

            <Text style={styles.name}>{user.full_name}</Text>

            {showEmail && (
                <Text style={styles.email}>{user.email}</Text>
            )}

            {user.bio && (
                <Text style={styles.bio}>{user.bio}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing[6],
        paddingHorizontal: spacing[4],
    },
    name: {
        ...typography.h2,
        color: colors.text.primary,
        marginTop: spacing[4],
        textAlign: 'center',
    },
    email: {
        ...typography.body,
        color: colors.text.secondary,
        marginTop: spacing[1],
    },
    bio: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginTop: spacing[3],
        paddingHorizontal: spacing[4],
        lineHeight: 22,
    },
});
