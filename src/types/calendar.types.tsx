// Calendar type definitions for Phase 5

// Calendar event from study group
export interface CalendarEvent {
    id: string;
    groupId: string;
    title: string; // Group subject
    description: string;
    startDate: Date;
    location: string;
    isCreator: boolean;
    memberCount: number;
    maxCapacity: number | null;
}

// Day with events
export interface CalendarDay {
    date: Date;
    dateString: string; // YYYY-MM-DD format
    isToday: boolean;
    isCurrentMonth: boolean;
    hasEvents: boolean;
    events: CalendarEvent[];
}

// Month data
export interface CalendarMonth {
    year: number;
    month: number; // 0-11
    days: CalendarDay[];
}

// Selected date state
export interface SelectedDateState {
    date: Date | null;
    dateString: string | null;
    events: CalendarEvent[];
}

// Device calendar event data
export interface DeviceCalendarEvent {
    title: string;
    startDate: Date;
    endDate: Date;
    location: string;
    notes: string;
    alarms?: { relativeOffset: number }[];
}

// Calendar view mode
export type CalendarViewMode = 'month' | 'week' | 'day';

// Export result
export interface ExportToCalendarResult {
    success: boolean;
    eventId?: string;
    error?: string;
}

// Calendar permissions
export interface CalendarPermissions {
    granted: boolean;
    canAskAgain: boolean;
}

// Calendar hook return type
export interface UseCalendarReturn {
    currentMonth: CalendarMonth;
    selectedDate: SelectedDateState;
    userEvents: CalendarEvent[];
    loading: boolean;
    error: string | null;
    goToNextMonth: () => void;
    goToPreviousMonth: () => void;
    goToToday: () => void;
    selectDate: (dateString: string) => void;
    refreshEvents: () => Promise<void>;
    exportToDeviceCalendar: (event: CalendarEvent) => Promise<ExportToCalendarResult>;
}

// Weekday names
export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

// Month names
export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const MONTH_NAMES_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;
