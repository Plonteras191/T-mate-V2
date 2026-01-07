// ImageAttachment Component - Display image in message bubble
import React from 'react';
import { Image, TouchableOpacity, StyleSheet, View, ActivityIndicator } from 'react-native';
import type { UploadedAttachment } from '../../types/attachment.types';
import { colors } from '../../theme/colors';

interface ImageAttachmentProps {
    attachment: UploadedAttachment;
    onPress: () => void;
    maxWidth?: number;
}

export const ImageAttachment: React.FC<ImageAttachmentProps> = ({
    attachment,
    onPress,
    maxWidth = 200,
}) => {
    const [loading, setLoading] = React.useState(true);

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { maxWidth }]}>
            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="small" color={colors.primary.main} />
                </View>
            )}
            <Image
                source={{ uri: attachment.thumbnail_url || attachment.file_url }}
                style={styles.image}
                resizeMode="cover"
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.background.tertiary,
        marginVertical: 4,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
});
