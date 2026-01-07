// AttachmentPicker Component - Bottom sheet for selecting attachment type
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface AttachmentPickerProps {
    visible: boolean;
    onImageSelect: () => void;
    onCameraSelect: () => void;
    onFileSelect: () => void;
    onClose: () => void;
}

export const AttachmentPicker: React.FC<AttachmentPickerProps> = ({
    visible,
    onImageSelect,
    onCameraSelect,
    onFileSelect,
    onClose,
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                            onCameraSelect();
                            onClose();
                        }}
                    >
                        <Text style={styles.icon}>📷</Text>
                        <Text style={styles.label}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                            onImageSelect();
                            onClose();
                        }}
                    >
                        <Text style={styles.icon}>🖼️</Text>
                        <Text style={styles.label}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => {
                            onFileSelect();
                            onClose();
                        }}
                    >
                        <Text style={styles.icon}>📄</Text>
                        <Text style={styles.label}>Document</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.surface.primary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: spacing[4],
        paddingBottom: spacing[6],
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[6],
    },
    icon: {
        fontSize: 28,
        marginRight: spacing[4],
    },
    label: {
        ...typography.body,
        fontSize: 16,
        color: colors.text.primary,
    },
    cancelButton: {
        marginTop: spacing[2],
        paddingVertical: spacing[4],
        alignItems: 'center',
    },
    cancelText: {
        ...typography.body,
        color: colors.danger.main,
        fontWeight: '600',
    },
});
