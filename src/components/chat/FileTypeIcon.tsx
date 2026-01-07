// FileTypeIcon Component
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { AttachmentType } from '../../types/attachment.types';
import { getFileIcon } from '../../utils/fileUtils';

interface FileTypeIconProps {
    type: AttachmentType;
    size?: number;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({ type, size = 40 }) => {
    const icon = getFileIcon(type);

    return <Text style={[styles.icon, { fontSize: size }]}>{icon}</Text>;
};

const styles = StyleSheet.create({
    icon: {
        textAlign: 'center',
    },
});
