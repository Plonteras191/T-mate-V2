// EditProfileScreen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button, Input, IconButton, LoadingSpinner } from '../../components/common';
import { ProfilePhoto } from '../../components/profile';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const EditProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { profile, loading, updateProfile, uploadPhoto, deletePhoto } = useProfile();
    const { refreshUser } = useAuth();

    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setBio(profile.bio || '');
        }
    }, [profile]);

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        setSaving(true);
        const success = await updateProfile({
            full_name: fullName.trim(),
            bio: bio.trim() || undefined,
        });
        setSaving(false);

        if (success) {
            // Refresh the auth context to sync user data across the app
            await refreshUser();
            Alert.alert('Success', 'Profile updated!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handlePhotoSelected = async (uri: string) => {
        setUploadingPhoto(true);
        const success = await uploadPhoto(uri);
        setUploadingPhoto(false);
        if (success) {
            // Refresh the auth context to sync user data across the app
            await refreshUser();
        } else {
            Alert.alert('Error', 'Failed to upload photo');
        }
    };

    const handlePhotoRemoved = async () => {
        setUploadingPhoto(true);
        const success = await deletePhoto();
        setUploadingPhoto(false);
        if (success) {
            // Refresh the auth context to sync user data across the app
            await refreshUser();
        } else {
            Alert.alert('Error', 'Failed to remove photo');
        }
    };

    if (loading && !profile) {
        return <LoadingSpinner fullScreen message="Loading profile..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <IconButton
                        icon="←"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                    />
                    <Text style={styles.title}>Edit Profile</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.form}
                    contentContainerStyle={styles.formContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Photo */}
                    <View style={styles.photoContainer}>
                        <ProfilePhoto
                            uri={profile?.profile_photo_url}
                            name={profile?.full_name || 'User'}
                            onPhotoSelected={handlePhotoSelected}
                            onPhotoRemoved={handlePhotoRemoved}
                            loading={uploadingPhoto}
                        />
                    </View>

                    {/* Form */}
                    <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Input
                        label="Bio"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.emailLabel}>Email</Text>
                    <Text style={styles.email}>{profile?.email}</Text>
                    <Text style={styles.emailHint}>Email cannot be changed</Text>

                    <Button
                        title="Save Changes"
                        onPress={handleSave}
                        loading={saving}
                        fullWidth
                        style={styles.saveButton}
                    />

                    <Button
                        title="Cancel"
                        onPress={() => navigation.goBack()}
                        variant="ghost"
                        fullWidth
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
    },
    headerSpacer: {
        width: 44,
    },
    form: {
        flex: 1,
    },
    formContent: {
        padding: spacing[4],
        paddingBottom: spacing[8],
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    emailLabel: {
        ...typography.label,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    email: {
        ...typography.body,
        color: colors.text.secondary,
    },
    emailHint: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginTop: spacing[1],
        marginBottom: spacing[4],
    },
    saveButton: {
        marginTop: spacing[6],
        marginBottom: spacing[3],
    },
});
