// ProgressBar Component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ProgressBarProps {
    progress: number; // 0-100
    height?: number;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 4,
    color = colors.primary.main,
    backgroundColor = colors.background.tertiary,
    borderRadius = 2,
}) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View
            style={[
                styles.container,
                {
                    height,
                    backgroundColor,
                    borderRadius,
                },
            ]}
        >
            <View
                style={[
                    styles.fill,
                    {
                        width: `${clampedProgress}%`,
                        backgroundColor: color,
                        borderRadius,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});
