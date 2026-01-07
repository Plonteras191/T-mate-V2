// EditGroupScreen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Input, LoadingSpinner } from '../../components/common';
import * as groupsService from '../../services/groups.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { GroupsScreenProps } from '../../types/navigation.types';

export const EditGroupScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<GroupsScreenProps<'EditGroup'>['route']>();
    const { groupId } = route.params;

    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [meetingDate, setMeetingDate] = useState(new Date());
    const [meetingLocation, setMeetingLocation] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchGroup = async () => {
            const result = await groupsService.getGroupById(groupId);
            if (result.success && result.data) {
                setSubject(result.data.subject);
                setDescription(result.data.description);
                setMeetingDate(new Date(result.data.meeting_schedule));
                setMeetingLocation(result.data.meeting_location);
                setMaxCapacity(result.data.max_capacity?.toString() || '');
            }
            setLoading(false);
        };
        fetchGroup();
    }, [groupId]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!subject.trim()) newErrors.subject = 'Subject is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!meetingLocation.trim()) newErrors.meetingLocation = 'Location is required';
        if (maxCapacity && (isNaN(Number(maxCapacity)) || Number(maxCapacity) < 2)) {
            newErrors.maxCapacity = 'Capacity must be at least 2';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        const result = await groupsService.updateGroup(groupId, {
            subject: subject.trim(),
            description: description.trim(),
            meeting_schedule: meetingDate.toISOString(),
            meeting_location: meetingLocation.trim(),
            max_capacity: maxCapacity ? Number(maxCapacity) : undefined,
        });
        setSaving(false);

        if (result.success) {
            Alert.alert('Success', 'Group updated!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Group',
            'Are you sure you want to delete this group? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeleting(true);
                        const result = await groupsService.deleteGroup(groupId);
                        setDeleting(false);
                        if (result.success) {
                            navigation.navigate('BrowseGroups');
                        } else {
                            Alert.alert('Error', result.message);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="Loading group..." />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Group</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
                    <Input
                        label="Subject *"
                        value={subject}
                        onChangeText={setSubject}
                        error={errors.subject}
                    />

                    <Input
                        label="Description *"
                        value={description}
                        onChangeText={setDescription}
                        error={errors.description}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.dateTimeContainer}>
                        <Text style={styles.label}>Meeting Date & Time</Text>
                        <View style={styles.dateTimeRow}>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.dateButtonText}>📅 {meetingDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
                                <Text style={styles.dateButtonText}>
                                    🕐 {meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={meetingDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(e, d) => { setShowDatePicker(false); if (d) setMeetingDate(d); }}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={meetingDate}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(e, t) => { setShowTimePicker(false); if (t) setMeetingDate(t); }}
                        />
                    )}

                    <Input
                        label="Meeting Location *"
                        value={meetingLocation}
                        onChangeText={setMeetingLocation}
                        error={errors.meetingLocation}
                    />

                    <Input
                        label="Max Capacity"
                        value={maxCapacity}
                        onChangeText={setMaxCapacity}
                        error={errors.maxCapacity}
                        keyboardType="number-pad"
                    />

                    <Button title="Save Changes" onPress={handleSave} loading={saving} fullWidth style={styles.saveButton} />

                    <Button
                        title="Delete Group"
                        onPress={handleDelete}
                        loading={deleting}
                        variant="danger"
                        fullWidth
                        style={styles.deleteButton}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background.primary },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    backButton: { ...typography.body, color: colors.primary.main, fontWeight: '500' },
    title: { ...typography.h3, color: colors.text.primary },
    headerSpacer: { width: 60 },
    form: { flex: 1 },
    formContent: { padding: spacing[4], paddingBottom: spacing[8] },
    label: { ...typography.label, color: colors.text.primary, marginBottom: spacing[2] },
    dateTimeContainer: { marginBottom: spacing[4] },
    dateTimeRow: { flexDirection: 'row', gap: spacing[3] },
    dateButton: {
        flex: 1,
        backgroundColor: colors.background.tertiary,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderRadius: 12,
        alignItems: 'center',
    },
    dateButtonText: { ...typography.body, color: colors.text.primary },
    saveButton: { marginTop: spacing[6] },
    deleteButton: { marginTop: spacing[3] },
});
