// UploadProgress Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from '../common/ProgressBar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface UploadProgressProps {
    progress: number; // 0-100
    status: 'uploading' | 'success' | 'error';
    onCancel?: () => void;
    onRetry?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
    progress,
    status,
    onCancel,
    onRetry,
}) => {
    return (
        <View style={styles.container}>
            <ProgressBar progress={progress} height={4} />
            <View style={styles.footer}>
                <Text style={styles.progressText}>
                    {status === 'uploading' && `${Math.round(progress)}%`}
                    {status === 'success' && '✓ Upload complete'}
                    {status === 'error' && '✗ Upload failed'}
                </Text>
                {status === 'uploading' && onCancel && (
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                )}
                {status === 'error' && onRetry && (
                    <TouchableOpacity onPress={onRetry}>
                        <Text style={styles.actionText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing[2],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing[1],
    },
    progressText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    actionText: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '600',
    },
});
