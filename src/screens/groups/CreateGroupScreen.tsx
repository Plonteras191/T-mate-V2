// CreateGroupScreen
import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Input, IconButton } from '../../components/common';
import * as groupsService from '../../services/groups.service';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { formatDateTime } from '../../utils/formatters';

export const CreateGroupScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [meetingDate, setMeetingDate] = useState(new Date());
    const [meetingLocation, setMeetingLocation] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!subject.trim()) {
            newErrors.subject = 'Subject is required';
        }
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!meetingLocation.trim()) {
            newErrors.meetingLocation = 'Location is required';
        }
        if (meetingDate <= new Date()) {
            newErrors.meetingDate = 'Meeting date must be in the future';
        }
        if (maxCapacity && (isNaN(Number(maxCapacity)) || Number(maxCapacity) < 2)) {
            newErrors.maxCapacity = 'Capacity must be at least 2';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validate()) return;

        setLoading(true);
        const result = await groupsService.createGroup({
            subject: subject.trim(),
            description: description.trim(),
            meeting_schedule: meetingDate.toISOString(),
            meeting_location: meetingLocation.trim(),
            max_capacity: maxCapacity ? Number(maxCapacity) : undefined,
        });
        setLoading(false);

        if (result.success && result.data) {
            Alert.alert('Success', 'Study group created!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('GroupDetails', { groupId: result.data!.id }),
                },
            ]);
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(meetingDate);
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            setMeetingDate(newDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(meetingDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setMeetingDate(newDate);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Group</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.form}
                    contentContainerStyle={styles.formContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Input
                        label="Subject *"
                        placeholder="e.g., Calculus 101"
                        value={subject}
                        onChangeText={setSubject}
                        error={errors.subject}
                    />

                    <Input
                        label="Description *"
                        placeholder="What will you study? What should members expect?"
                        value={description}
                        onChangeText={setDescription}
                        error={errors.description}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.dateTimeContainer}>
                        <Text style={styles.label}>Meeting Date & Time *</Text>
                        <View style={styles.dateTimeRow}>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    📅 {meetingDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    🕐 {meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {errors.meetingDate && (
                            <Text style={styles.errorText}>{errors.meetingDate}</Text>
                        )}
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={meetingDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={meetingDate}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                        />
                    )}

                    <Input
                        label="Meeting Location *"
                        placeholder="e.g., Library Room 203"
                        value={meetingLocation}
                        onChangeText={setMeetingLocation}
                        error={errors.meetingLocation}
                    />

                    <Input
                        label="Max Capacity (optional)"
                        placeholder="Leave empty for unlimited"
                        value={maxCapacity}
                        onChangeText={setMaxCapacity}
                        error={errors.maxCapacity}
                        keyboardType="number-pad"
                    />

                    <Button
                        title="Create Group"
                        onPress={handleCreate}
                        loading={loading}
                        fullWidth
                        style={styles.createButton}
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
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    backButton: {
        ...typography.body,
        color: colors.primary.main,
        fontWeight: '500',
    },
    title: {
        ...typography.h3,
        color: colors.text.primary,
    },
    headerSpacer: {
        width: 60,
    },
    form: {
        flex: 1,
    },
    formContent: {
        padding: spacing[4],
        paddingBottom: spacing[8],
    },
    label: {
        ...typography.label,
        color: colors.text.primary,
        marginBottom: spacing[2],
    },
    dateTimeContainer: {
        marginBottom: spacing[4],
    },
    dateTimeRow: {
        flexDirection: 'row',
        gap: spacing[3],
    },
    dateButton: {
        flex: 1,
        backgroundColor: colors.background.tertiary,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderRadius: 12,
        alignItems: 'center',
    },
    dateButtonText: {
        ...typography.body,
        color: colors.text.primary,
    },
    errorText: {
        ...typography.caption,
        color: colors.danger.main,
        marginTop: spacing[1],
    },
    createButton: {
        marginTop: spacing[6],
    },
});
