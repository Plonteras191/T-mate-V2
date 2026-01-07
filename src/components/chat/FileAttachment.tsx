// FileAttachment Component - Display file in message bubble
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { UploadedAttachment } from '../../types/attachment.types';
import { FileTypeIcon } from './FileTypeIcon';
import { ProgressBar } from '../common/ProgressBar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatFileSize } from '../../utils/formatters';

interface FileAttachmentProps {
    attachment: UploadedAttachment;
    onPress: () => void;
    downloading?: boolean;
    downloadProgress?: number;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({
    attachment,
    onPress,
    downloading = false,
    downloadProgress = 0,
}) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            disabled={downloading}
        >
            <View style={styles.iconContainer}>
                <FileTypeIcon type={attachment.attachment_type} size={32} />
            </View>

            <View style={styles.info}>
                <Text style={styles.fileName} numberOfLines={1}>
                    {attachment.file_name}
                </Text>
                <Text style={styles.fileSize}>{formatFileSize(attachment.file_size)}</Text>
                {downloading && (
                    <ProgressBar progress={downloadProgress} height={3} />
                )}
            </View>

            <View style={styles.downloadIcon}>
                <Text style={styles.downloadText}>{downloading ? '...' : '⬇️'}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[3],
        backgroundColor: colors.background.tertiary,
        borderRadius: 12,
        marginVertical: 4,
    },
    iconContainer: {
        marginRight: spacing[3],
    },
    info: {
        flex: 1,
    },
    fileName: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
    },
    fileSize: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: 2,
    },
    downloadIcon: {
        marginLeft: spacing[2],
    },
    downloadText: {
        fontSize: 20,
    },
});
