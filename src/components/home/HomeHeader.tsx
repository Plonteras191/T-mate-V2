import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '../common';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { getGreeting } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

export const HomeHeader: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Avatar
                        uri={user?.profile_photo_url}
                        name={user?.full_name || 'User'}
                        size="medium"
                    />
                </TouchableOpacity>

                <View style={styles.textContainer}>
                    <Text style={styles.greeting}>{getGreeting()}</Text>
                    <Text style={styles.userName} numberOfLines={1}>
                        {user?.full_name?.split(' ')[0] || 'Student'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.notificationButton}>
                    <Feather name="bell" size={24} color={colors.text.primary} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        backgroundColor: colors.background.primary,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    userName: {
        ...typography.h3,
        color: colors.text.primary,
    },
    notificationButton: {
        padding: spacing[2],
        backgroundColor: colors.surface.primary,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.border.light,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.feedback.error,
        borderWidth: 1,
        borderColor: colors.surface.primary,
    },
});
