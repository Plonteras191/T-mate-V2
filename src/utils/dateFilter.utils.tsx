// Date Filter Utilities
// Helper functions for schedule and time-based filtering

export type DateRangeFilter = 'all' | 'today' | 'week' | 'month';
export type TimeSlotFilter = 'all' | 'morning' | 'afternoon' | 'evening';

export interface DateRange {
    start: string;
    end: string;
}

export interface TimeRange {
    startHour: number;
    endHour: number;
}

/**
 * Get date range for a given filter
 * @param filter - The date range filter type
 * @returns Object with start and end ISO date strings
 */
export const getDateRangeForFilter = (filter: DateRangeFilter): DateRange | null => {
    if (filter === 'all') return null;

    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (filter) {
        case 'today':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;

        case 'week':
            // Start of current week (Sunday)
            const dayOfWeek = now.getDay();
            start.setDate(now.getDate() - dayOfWeek);
            start.setHours(0, 0, 0, 0);
            // End of current week (Saturday)
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;

        case 'month':
            // Start of current month
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            // End of current month
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;

        default:
            return null;
    }

    return {
        start: start.toISOString(),
        end: end.toISOString(),
    };
};

/**
 * Get hour range for a time slot
 * @param timeSlot - The time slot filter type
 * @returns Object with start and end hours (24-hour format)
 */
export const getTimeRangeForSlot = (timeSlot: TimeSlotFilter): TimeRange | null => {
    if (timeSlot === 'all') return null;

    switch (timeSlot) {
        case 'morning':
            return { startHour: 6, endHour: 11 }; // 6 AM - 11:59 AM

        case 'afternoon':
            return { startHour: 12, endHour: 17 }; // 12 PM - 5:59 PM

        case 'evening':
            return { startHour: 18, endHour: 23 }; // 6 PM - 11:59 PM

        default:
            return null;
    }
};

/**
 * Check if a timestamp falls within a specific time slot
 * @param timestamp - ISO timestamp string
 * @param timeSlot - The time slot to check against
 * @returns True if the timestamp falls within the time slot
 */
export const isTimeInSlot = (timestamp: string, timeSlot: TimeSlotFilter): boolean => {
    if (timeSlot === 'all') return true;

    const timeRange = getTimeRangeForSlot(timeSlot);
    if (!timeRange) return true;

    const date = new Date(timestamp);
    const hour = date.getHours();

    return hour >= timeRange.startHour && hour <= timeRange.endHour;
};

/**
 * Filter an array of items by time slot based on a timestamp field
 * @param items - Array of items to filter
 * @param timestampField - Name of the field containing the timestamp
 * @param timeSlot - The time slot to filter by
 * @returns Filtered array
 */
export const filterByTimeSlot = <T extends Record<string, any>>(
    items: T[],
    timestampField: keyof T,
    timeSlot: TimeSlotFilter
): T[] => {
    if (timeSlot === 'all') return items;

    return items.filter((item) => {
        const timestamp = item[timestampField];
        if (!timestamp || typeof timestamp !== 'string') return false;
        return isTimeInSlot(timestamp, timeSlot);
    });
};

/**
 * Get a human-readable label for a date range filter
 * @param filter - The date range filter type
 * @returns Human-readable label
 */
export const getDateRangeLabel = (filter: DateRangeFilter): string => {
    switch (filter) {
        case 'all':
            return 'All Dates';
        case 'today':
            return 'Today';
        case 'week':
            return 'This Week';
        case 'month':
            return 'This Month';
        default:
            return 'All Dates';
    }
};

/**
 * Get a human-readable label for a time slot filter
 * @param timeSlot - The time slot filter type
 * @returns Human-readable label
 */
export const getTimeSlotLabel = (timeSlot: TimeSlotFilter): string => {
    switch (timeSlot) {
        case 'all':
            return 'All Times';
        case 'morning':
            return 'Morning (6AM-12PM)';
        case 'afternoon':
            return 'Afternoon (12PM-6PM)';
        case 'evening':
            return 'Evening (6PM-12AM)';
        default:
            return 'All Times';
    }
};
