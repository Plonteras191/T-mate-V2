// ProfilePhoto Component
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActionSheetIOS,
    Platform,
} from 'react-native';
import { Avatar } from '../common/Avatar';
import { Modal, Button } from '../common';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { pickImage, takePhoto } from '../../utils/imageUtils';

interface ProfilePhotoProps {
    uri: string | null | undefined;
    name: string;
    onPhotoSelected: (uri: string) => void;
    onPhotoRemoved?: () => void;
    loading?: boolean;
    size?: 'large' | 'xlarge';
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
    uri,
    name,
    onPhotoSelected,
    onPhotoRemoved,
    loading = false,
    size = 'xlarge',
}) => {
    const [showOptions, setShowOptions] = useState(false);

    const handlePress = () => {
        if (Platform.OS === 'ios') {
            const options = ['Take Photo', 'Choose from Gallery'];
            if (uri) options.push('Remove Photo');
            options.push('Cancel');

            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex: options.length - 1,
                    destructiveButtonIndex: uri ? options.length - 2 : undefined,
                },
                (buttonIndex) => {
                    if (buttonIndex === 0) handleTakePhoto();
                    else if (buttonIndex === 1) handlePickImage();
                    else if (buttonIndex === 2 && uri) onPhotoRemoved?.();
                }
            );
        } else {
            setShowOptions(true);
        }
    };

    const handleTakePhoto = async () => {
        setShowOptions(false);
        const result = await takePhoto();
        if (result.success && result.uri) {
            onPhotoSelected(result.uri);
        } else if (result.error) {
            Alert.alert('Error', result.error);
        }
    };

    const handlePickImage = async () => {
        setShowOptions(false);
        const result = await pickImage();
        if (result.success && result.uri) {
            onPhotoSelected(result.uri);
        } else if (result.error) {
            Alert.alert('Error', result.error);
        }
    };

    const handleRemove = () => {
        setShowOptions(false);
        onPhotoRemoved?.();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} disabled={loading}>
                <Avatar
                    uri={uri}
                    name={name}
                    size={size}
                    showEditButton
                    onEditPress={handlePress}
                />
            </TouchableOpacity>

            <Text style={styles.hint}>Tap to change photo</Text>

            <Modal
                visible={showOptions}
                onClose={() => setShowOptions(false)}
                title="Change Photo"
            >
                <View style={styles.optionsContainer}>
                    <Button
                        title="📷 Take Photo"
                        onPress={handleTakePhoto}
                        variant="outline"
                        fullWidth
                        style={styles.optionButton}
                    />
                    <Button
                        title="🖼️ Choose from Gallery"
                        onPress={handlePickImage}
                        variant="outline"
                        fullWidth
                        style={styles.optionButton}
                    />
                    {uri && (
                        <Button
                            title="🗑️ Remove Photo"
                            onPress={handleRemove}
                            variant="danger"
                            fullWidth
                            style={styles.optionButton}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    hint: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginTop: spacing[2],
    },
    optionsContainer: {
        gap: spacing[3],
    },
    optionButton: {
        marginBottom: spacing[2],
    },
});
