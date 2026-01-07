// Card Component
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

type CardElevation = 'none' | 'small' | 'medium';
type CardPadding = 'none' | 'small' | 'medium' | 'large';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    elevation?: CardElevation;
    padding?: CardPadding;
}

const PADDING_VALUES: Record<CardPadding, number> = {
    none: 0,
    small: spacing[3],
    medium: spacing[4],
    large: spacing[6],
};

export const Card: React.FC<CardProps> = ({
    children,
    style,
    onPress,
    elevation = 'small',
    padding = 'medium',
}) => {
    const cardStyle: ViewStyle = {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.lg,
        padding: PADDING_VALUES[padding],
        ...(elevation === 'none' ? {} : shadows[elevation === 'medium' ? 'md' : 'sm']),
    };

    if (onPress) {
        return (
            <TouchableOpacity
                style={[cardStyle, style]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[cardStyle, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({});
