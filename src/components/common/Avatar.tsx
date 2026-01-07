// Avatar Component
import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    ImageStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/spacing';
import { getInitials } from '../../utils/formatters';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
    uri: string | null | undefined;
    name: string;
    size?: AvatarSize;
    onPress?: () => void;
    showEditButton?: boolean;
    onEditPress?: () => void;
    style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 96,
};

const FONT_SIZES: Record<AvatarSize, number> = {
    small: 12,
    medium: 16,
    large: 24,
    xlarge: 32,
};

export const Avatar: React.FC<AvatarProps> = ({
    uri,
    name,
    size = 'medium',
    onPress,
    showEditButton = false,
    onEditPress,
    style,
}) => {
    const dimension = SIZES[size];
    const fontSize = FONT_SIZES[size];
    const initials = getInitials(name);

    const dynamicStyle = {
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
    };

    const content = uri ? (
        <Image
            source={{ uri }}
            style={[styles.image, dynamicStyle]}
        />
    ) : (
        <View style={[styles.placeholder, dynamicStyle]}>
            <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
    );

    return (
        <View style={[styles.container, style]}>
            {onPress ? (
                <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                    {content}
                </TouchableOpacity>
            ) : (
                content
            )}
            {showEditButton && (
                <TouchableOpacity
                    style={[
                        styles.editButton,
                        {
                            right: size === 'small' ? -2 : 0,
                            bottom: size === 'small' ? -2 : 0,
                        },
                    ]}
                    onPress={onEditPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        backgroundColor: colors.background.tertiary,
    },
    placeholder: {
        backgroundColor: colors.primary.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: colors.primary.contrast,
        fontWeight: typography.button.fontWeight,
    },
    editButton: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.surface.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.background.primary,
    },
    editIcon: {
        fontSize: 12,
    },
});
