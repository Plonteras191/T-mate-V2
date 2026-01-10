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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CalendarHeader, CalendarGrid, MeetingCard } from '../../components/calendar';
import { LoadingSpinner } from '../../components/common';
import { useCalendar } from '../../hooks/useCalendar';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { CalendarEvent } from '../../types/calendar.types';
import { Feather } from '@expo/vector-icons';

export const CalendarScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();
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

        const today = new Date();
        const isToday = today.toDateString() === selectedDate.date.toDateString();

        if (isToday) return 'Today, ' + selectedDate.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        return selectedDate.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading && currentMonth.days.length === 0) {
        return <LoadingSpinner fullScreen message="Loading calendar..." />;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.headerBackground, { paddingTop: insets.top }]}>
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
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingBottom: insets.bottom + 90 }
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refreshEvents}
                        colors={[colors.primary.main]}
                        tintColor={colors.primary.main}
                    />
                }
            >
                {/* Selected date events */}
                <View style={styles.eventsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.selectedDateText}>
                            {formatSelectedDate()}
                        </Text>
                        <View style={styles.eventCountBadge}>
                            <Text style={styles.eventCountText}>{selectedDate.events.length} Events</Text>
                        </View>
                    </View>

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
                            <View style={styles.iconContainer}>
                                <Feather name="calendar" size={40} color={colors.text.tertiary} />
                            </View>
                            <Text style={styles.noEventsTitle}>No meetings scheduled</Text>
                            <Text style={styles.noEventsText}>
                                You don't have any group meetings on this day.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.noEventsContainer}>
                            <View style={styles.iconContainer}>
                                <Feather name="mouse-pointer" size={40} color={colors.text.tertiary} />
                            </View>
                            <Text style={styles.noEventsTitle}>Select a date</Text>
                            <Text style={styles.noEventsText}>
                                Tap on a date above to view scheduled meetings.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Error message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Feather name="alert-circle" size={20} color={colors.danger.main} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    headerBackground: {
        backgroundColor: colors.surface.primary,
        zIndex: 10,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    eventsSection: {
        marginTop: spacing[4],
        minHeight: 200,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        marginBottom: spacing[3],
    },
    selectedDateText: {
        ...typography.h4,
        color: colors.text.primary,
        fontWeight: '700',
    },
    eventCountBadge: {
        backgroundColor: colors.primary.light + '20',
        paddingHorizontal: spacing[3],
        paddingVertical: 4,
        borderRadius: 12,
    },
    eventCountText: {
        ...typography.caption,
        color: colors.primary.main,
        fontWeight: '600',
    },
    noEventsContainer: {
        alignItems: 'center',
        paddingVertical: spacing[8],
        paddingHorizontal: spacing[6],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surface.primary, // white on gray bg
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[3],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    noEventsTitle: {
        ...typography.h4,
        color: colors.text.primary,
        marginBottom: spacing[1],
        textAlign: 'center',
    },
    noEventsText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    errorContainer: {
        margin: spacing[4],
        padding: spacing[3],
        backgroundColor: colors.danger.light + '20',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        justifyContent: 'center',
    },
    errorText: {
        ...typography.body,
        color: colors.danger.main,
        textAlign: 'center',
    },
});
