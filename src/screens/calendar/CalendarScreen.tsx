// CalendarScreen - Monthly calendar view with group meetings
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CalendarHeader, CalendarGrid, MeetingCard } from '../../components/calendar';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { useCalendar } from '../../hooks/useCalendar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { CalendarEvent } from '../../types/calendar.types';

export const CalendarScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const {
        currentMonth,
        selectedDate,
        loading,
        error,
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        selectDate,
        refreshEvents,
        exportToDeviceCalendar,
    } = useCalendar();

    const handleMeetingPress = (event: CalendarEvent) => {
        // Navigate to group details
        navigation.navigate('Groups', {
            screen: 'GroupDetails',
            params: { groupId: event.groupId },
        });
    };

    const handleAddToCalendar = async (event: CalendarEvent) => {
        const result = await exportToDeviceCalendar(event);
        if (!result.success) {
            Alert.alert(
                'Calendar Error',
                result.error || 'Failed to add event to calendar'
            );
        }
    };

    const formatSelectedDate = (): string => {
        if (!selectedDate.date) return 'Select a date';
        return selectedDate.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading && currentMonth.days.length === 0) {
        return <LoadingSpinner fullScreen message="Loading calendar..." />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Screen header */}
            <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>📅 Calendar</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refreshEvents}
                        colors={[colors.primary.main]}
                    />
                }
            >
                {/* Calendar header with navigation */}
                <CalendarHeader
                    year={currentMonth.year}
                    month={currentMonth.month}
                    onPreviousMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                    onToday={goToToday}
                />

                {/* Calendar grid */}
                <CalendarGrid
                    days={currentMonth.days}
                    selectedDateString={selectedDate.dateString}
                    onSelectDate={selectDate}
                />

                {/* Selected date events */}
                <View style={styles.eventsSection}>
                    <Text style={styles.selectedDateText}>
                        {formatSelectedDate()}
                    </Text>

                    {selectedDate.events.length > 0 ? (
                        selectedDate.events.map((event) => (
                            <MeetingCard
                                key={event.id}
                                event={event}
                                onPress={() => handleMeetingPress(event)}
                                onAddToCalendar={handleAddToCalendar}
                            />
                        ))
                    ) : selectedDate.date ? (
                        <View style={styles.noEventsContainer}>
                            <Text style={styles.noEventsIcon}>📭</Text>
                            <Text style={styles.noEventsText}>
                                No meetings scheduled for this day
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.noEventsContainer}>
                            <Text style={styles.noEventsIcon}>👆</Text>
                            <Text style={styles.noEventsText}>
                                Tap a date to see meetings
                            </Text>
                        </View>
                    )}
                </View>

                {/* Error message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Bottom padding */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    screenHeader: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        backgroundColor: colors.surface.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    screenTitle: {
        ...typography.h2,
        color: colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    eventsSection: {
        marginTop: spacing[4],
    },
    selectedDateText: {
        ...typography.h4,
        color: colors.text.primary,
        paddingHorizontal: spacing[4],
        marginBottom: spacing[2],
    },
    noEventsContainer: {
        alignItems: 'center',
        paddingVertical: spacing[8],
        paddingHorizontal: spacing[4],
    },
    noEventsIcon: {
        fontSize: 48,
        marginBottom: spacing[3],
    },
    noEventsText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    errorContainer: {
        margin: spacing[4],
        padding: spacing[3],
        backgroundColor: colors.danger.light + '40',
        borderRadius: 8,
    },
    errorText: {
        ...typography.body,
        color: colors.danger.main,
        textAlign: 'center',
    },
    bottomPadding: {
        height: 100,
    },
});
