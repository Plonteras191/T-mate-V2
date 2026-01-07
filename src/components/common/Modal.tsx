// Modal Component
import React from 'react';
import {
    Modal as RNModal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
}) => {
    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        >
                            <View style={styles.content}>
                                {title && (
                                    <View style={styles.header}>
                                        <Text style={styles.title}>{title}</Text>
                                        <TouchableOpacity
                                            onPress={onClose}
                                            style={styles.closeButton}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Text style={styles.closeIcon}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                <View style={styles.body}>{children}</View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing[6],
    },
    content: {
        backgroundColor: colors.surface.primary,
        borderRadius: borderRadius.xl,
        width: '100%',
        maxWidth: 400,
        ...shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[5],
        paddingTop: spacing[5],
        paddingBottom: spacing[3],
    },
    title: {
        ...typography.h4,
        color: colors.text.primary,
        flex: 1,
    },
    closeButton: {
        marginLeft: spacing[3],
    },
    closeIcon: {
        fontSize: 18,
        color: colors.text.secondary,
    },
    body: {
        paddingHorizontal: spacing[5],
        paddingBottom: spacing[5],
    },
});
