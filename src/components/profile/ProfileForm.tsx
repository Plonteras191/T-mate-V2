// ProfileForm Component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from '../common';
import { spacing } from '../../theme/spacing';

interface ProfileFormProps {
    fullName: string;
    bio: string;
    onFullNameChange: (text: string) => void;
    onBioChange: (text: string) => void;
    onSave: () => void;
    loading?: boolean;
    errors?: {
        fullName?: string;
        bio?: string;
    };
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
    fullName,
    bio,
    onFullNameChange,
    onBioChange,
    onSave,
    loading = false,
    errors,
}) => {
    return (
        <View style={styles.container}>
            <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={onFullNameChange}
                error={errors?.fullName}
                autoCapitalize="words"
            />

            <Input
                label="Bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChangeText={onBioChange}
                error={errors?.bio}
                multiline
                numberOfLines={4}
                containerStyle={styles.bioInput}
            />

            <Button
                title="Save Changes"
                onPress={onSave}
                loading={loading}
                fullWidth
                style={styles.saveButton}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing[4],
    },
    bioInput: {
        minHeight: 100,
    },
    saveButton: {
        marginTop: spacing[4],
    },
});
