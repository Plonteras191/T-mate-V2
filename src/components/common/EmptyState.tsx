// EmptyState Component
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { Button } from './Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = '📭',
    title,
    description,
    actionLabel,
    onAction,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.title}>{title}</Text>
            {description && (
                <Text style={styles.description}>{description}</Text>
            )}
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    variant="primary"
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing[8],
    },
    icon: {
        fontSize: 64,
        marginBottom: spacing[4],
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing[2],
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing[6],
    },
    button: {
        minWidth: 150,
    },
});
