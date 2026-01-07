// ImageViewer Component - Full screen image modal (simplified)
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { colors } from '../../theme/colors';

interface ImageViewerProps {
    imageUrl: string;
    visible: boolean;
    onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
    imageUrl,
    visible,
    onClose,
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <View style={styles.closeCircle}>
                        <Text style={styles.closeText}>✕</Text>
                    </View>
                </TouchableOpacity>

                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    closeCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 24,
        color: colors.text.inverse,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
