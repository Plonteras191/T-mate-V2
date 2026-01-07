// Loading Spinner Component
import React from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

type SpinnerSize = 'small' | 'large';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    color?: string;
    message?: string;
    fullScreen?: boolean;
    containerStyle?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = colors.primary.main,
    message,
    fullScreen = false,
    containerStyle,
}) => {
    return (
        <View
            style={[
                styles.container,
                fullScreen && styles.fullScreen,
                containerStyle,
            ]}
        >
            <ActivityIndicator
                size={size}
                color={color}
            />
            {message && (
                <Text style={styles.message}>{message}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing[4],
    },
    fullScreen: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    message: {
        ...typography.body,
        color: colors.text.secondary,
        marginTop: spacing[3],
        textAlign: 'center',
    },
});
