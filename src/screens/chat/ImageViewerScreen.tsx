// ImageViewerScreen - Full screen image viewer
import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    StatusBar,
    Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import type { StackScreenProps } from '@react-navigation/stack';
import type { GroupsStackParamList } from '../../types/navigation.types';

type Props = StackScreenProps<GroupsStackParamList, 'ImageViewer'>;

export const ImageViewerScreen: React.FC<Props> = ({ route, navigation }) => {
    const { imageUrl, senderName } = route.params;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const insets = useSafeAreaInsets();

    const handleDownload = async () => {
        // TODO: Implement download functionality
        console.log('Download image:', imageUrl);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                    <Text style={styles.buttonText}>✕</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDownload} style={styles.button}>
                    <Text style={styles.buttonText}>⬇️</Text>
                </TouchableOpacity>
            </View>

            {/* Image */}
            <View style={styles.imageContainer}>
                {loading && (
                    <ActivityIndicator size="large" color="white" style={styles.loader} />
                )}
                {error && (
                    <Text style={styles.errorText}>Failed to load image</Text>
                )}
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onError={() => {
                        setError(true);
                        setLoading(false);
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    loader: {
        position: 'absolute',
    },
    errorText: {
        color: 'white',
        fontSize: 16,
    },
});
