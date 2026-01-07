// AttachmentPreview Component - Preview pending attachments before sending
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { PendingAttachment } from '../../types/attachment.types';
import { FileTypeIcon } from './FileTypeIcon';
import { UploadProgress } from './UploadProgress';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { getAttachmentType, isImageType } from '../../utils/fileUtils';
import { formatFileSize } from '../../utils/formatters';

interface AttachmentPreviewProps {
    attachments: PendingAttachment[];
    onRemove: (id: string) => void;
    onRetry?: (id: string) => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
    attachments,
    onRemove,
    onRetry,
}) => {
    if (attachments.length === 0) return null;

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {attachments.map((attachment) => {
                    const isImage = isImageType(attachment.localFile.type);

                    return (
                        <View key={attachment.id} style={styles.attachmentCard}>
                            {/* Remove button */}
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemove(attachment.id)}
                            >
                                <Text style={styles.removeIcon}>✕</Text>
                            </TouchableOpacity>

                            {/* Thumbnail */}
                            <View style={styles.thumbnail}>
                                {isImage ? (
                                    <Image
                                        source={{ uri: attachment.localFile.uri }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <FileTypeIcon
                                        type={getAttachmentType(attachment.localFile.type)}
                                        size={32}
                                    />
                                )}
                            </View>

                            {/* File info */}
                            <Text style={styles.fileName} numberOfLines={1}>
                                {attachment.localFile.name}
                            </Text>
                            <Text style={styles.fileSize}>
                                {formatFileSize(attachment.localFile.size)}
                            </Text>

                            {/* Progress */}
                            {attachment.status === 'uploading' && (
                                <View style={styles.progressContainer}>
                                    <UploadProgress
                                        progress={attachment.uploadProgress}
                                        status="uploading"
                                    />
                                </View>
                            )}

                            {/* Error state */}
                            {attachment.status === 'error' && (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>Failed</Text>
                                    {onRetry && (
                                        <TouchableOpacity onPress={() => onRetry(attachment.id)}>
                                            <Text style={styles.retryText}>Retry</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[2],
        backgroundColor: colors.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    attachmentCard: {
        width: 80,
        marginRight: spacing[2],
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.danger.main,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    removeIcon: {
        color: colors.text.inverse,
        fontSize: 14,
        fontWeight: 'bold',
    },
    thumbnail: {
        width: 80,
        height: 80,
        backgroundColor: colors.background.tertiary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    fileName: {
        ...typography.caption,
        color: colors.text.primary,
        marginTop: spacing[1],
    },
    fileSize: {
        ...typography.caption,
        fontSize: 10,
        color: colors.text.tertiary,
    },
    progressContainer: {
        marginTop: spacing[1],
    },
    errorContainer: {
        marginTop: spacing[1],
        alignItems: 'center',
    },
    errorText: {
        ...typography.caption,
        color: colors.danger.main,
        fontSize: 10,
    },
    retryText: {
        ...typography.caption,
        color: colors.primary.main,
        fontSize: 10,
        fontWeight: '600',
    },
});
