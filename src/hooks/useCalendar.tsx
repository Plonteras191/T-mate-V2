// useCalendar Hook - Calendar state management
import { useState, useEffect, useCallback, useMemo } from 'react';
import * as calendarService from '../services/calendar.service';
import type {
    CalendarEvent,
    CalendarMonth,
    CalendarDay,
    SelectedDateState,
    UseCalendarReturn,
    ExportToCalendarResult,
} from '../types/calendar.types';

/**
 * Format date to YYYY-MM-DD string
 */
const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Check if two dates are the same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
    return formatDateString(date1) === formatDateString(date2);
};

/**
 * Generate calendar days for a month
 */
const generateMonthDays = (
    year: number,
    month: number,
    events: CalendarEvent[]
): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();
    
    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
        const dateString = formatDateString(date);
        const dayEvents = events.filter((e) => formatDateString(e.startDate) === dateString);
        
        days.push({
            date,
            dateString,
            isToday: isSameDay(date, today),
            isCurrentMonth: false,
            hasEvents: dayEvents.length > 0,
            events: dayEvents,
        });
    }
    
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateString = formatDateString(date);
        const dayEvents = events.filter((e) => formatDateString(e.startDate) === dateString);
        
        days.push({
            date,
            dateString,
            isToday: isSameDay(date, today),
            isCurrentMonth: true,
            hasEvents: dayEvents.length > 0,
            events: dayEvents,
        });
    }
    
    // Add days from next month to complete the grid (6 rows x 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        const dateString = formatDateString(date);
        const dayEvents = events.filter((e) => formatDateString(e.startDate) === dateString);
        
        days.push({
            date,
            dateString,
            isToday: isSameDay(date, today),
            isCurrentMonth: false,
            hasEvents: dayEvents.length > 0,
            events: dayEvents,
        });
    }
    
    return days;
};

export const useCalendar = (): UseCalendarReturn => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<SelectedDateState>({
        date: null,
        dateString: null,
        events: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    /**
     * Fetch events for current month
     */
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const events = await calendarService.getMeetingsForMonth(year, month);
            setUserEvents(events);
        } catch (err) {
            setError('Failed to load meetings');
            console.error('Error fetching calendar events:', err);
        } finally {
            setLoading(false);
        }
    }, [year, month]);

    /**
     * Load events on mount and when month changes
     */
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    /**
     * Generate current month data
     */
    const currentMonth: CalendarMonth = useMemo(() => {
        return {
            year,
            month,
            days: generateMonthDays(year, month, userEvents),
        };
    }, [year, month, userEvents]);

    /**
     * Navigate to next month
     */
    const goToNextMonth = useCallback(() => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    /**
     * Navigate to previous month
     */
    const goToPreviousMonth = useCallback(() => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    /**
     * Go to today
     */
    const goToToday = useCallback(() => {
        const today = new Date();
        setCurrentDate(today);
        const dateString = formatDateString(today);
        const dayEvents = userEvents.filter(
            (e) => formatDateString(e.startDate) === dateString
        );
        setSelectedDate({
            date: today,
            dateString,
            events: dayEvents,
        });
    }, [userEvents]);

    /**
     * Select a date
     */
    const selectDate = useCallback(
        (dateString: string) => {
            const date = new Date(dateString);
            const dayEvents = userEvents.filter(
                (e) => formatDateString(e.startDate) === dateString
            );
            setSelectedDate({
                date,
                dateString,
                events: dayEvents,
            });
        },
        [userEvents]
    );

    /**
     * Refresh events
     */
    const refreshEvents = useCallback(async () => {
        await fetchEvents();
    }, [fetchEvents]);

    /**
     * Export event to device calendar
     */
    const exportToDeviceCalendar = useCallback(
        async (event: CalendarEvent): Promise<ExportToCalendarResult> => {
            return await calendarService.exportToDeviceCalendar(event);
        },
        []
    );

    return {
        currentMonth,
        selectedDate,
        userEvents,
        loading,
        error,
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        selectDate,
        refreshEvents,
        exportToDeviceCalendar,
    };
};
