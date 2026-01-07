// Calendar Service - Fetch user meetings and device calendar integration
import { supabase } from './supabase';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import type {
    CalendarEvent,
    DeviceCalendarEvent,
    ExportToCalendarResult,
    CalendarPermissions,
} from '../types/calendar.types';

/**
 * Get all groups the user has joined with their meeting schedules
 */
export const getUserGroupMeetings = async (): Promise<CalendarEvent[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get all groups the user is a member of
        const { data: memberships, error: memberError } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id);

        if (memberError) throw memberError;
        if (!memberships || memberships.length === 0) return [];

        const groupIds = memberships.map((m: any) => m.group_id);

        // Get group details for all memberships
        const { data: groups, error: groupsError } = await supabase
            .from('study_groups')
            .select('*')
            .in('id', groupIds)
            .order('meeting_schedule', { ascending: true });

        if (groupsError) throw groupsError;

        // Get member counts for each group
        const events: CalendarEvent[] = await Promise.all(
            (groups || []).map(async (group: any) => {
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', group.id);

                return {
                    id: group.id,
                    groupId: group.id,
                    title: group.subject,
                    description: group.description,
                    startDate: new Date(group.meeting_schedule),
                    location: group.meeting_location,
                    isCreator: group.creator_id === user.id,
                    memberCount: count || 0,
                    maxCapacity: group.max_capacity,
                };
            })
        );

        return events;
    } catch (error) {
        console.error('Error fetching user meetings:', error);
        return [];
    }
};

/**
 * Get meetings for a specific month
 */
export const getMeetingsForMonth = async (
    year: number,
    month: number
): Promise<CalendarEvent[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Calculate month boundaries
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59);

        // Get all groups the user is a member of
        const { data: memberships, error: memberError } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id);

        if (memberError) throw memberError;
        if (!memberships || memberships.length === 0) return [];

        const groupIds = memberships.map((m: any) => m.group_id);

        // Get groups with meetings in this month
        const { data: groups, error: groupsError } = await supabase
            .from('study_groups')
            .select('*')
            .in('id', groupIds)
            .gte('meeting_schedule', startDate.toISOString())
            .lte('meeting_schedule', endDate.toISOString())
            .order('meeting_schedule', { ascending: true });

        if (groupsError) throw groupsError;

        // Map to calendar events
        const events: CalendarEvent[] = await Promise.all(
            (groups || []).map(async (group: any) => {
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', group.id);

                return {
                    id: group.id,
                    groupId: group.id,
                    title: group.subject,
                    description: group.description,
                    startDate: new Date(group.meeting_schedule),
                    location: group.meeting_location,
                    isCreator: group.creator_id === user.id,
                    memberCount: count || 0,
                    maxCapacity: group.max_capacity,
                };
            })
        );

        return events;
    } catch (error) {
        console.error('Error fetching meetings for month:', error);
        return [];
    }
};

/**
 * Get upcoming meetings (next 7 days)
 */
export const getUpcomingMeetings = async (days: number = 7): Promise<CalendarEvent[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        // Get all groups the user is a member of
        const { data: memberships, error: memberError } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user.id);

        if (memberError) throw memberError;
        if (!memberships || memberships.length === 0) return [];

        const groupIds = memberships.map((m: any) => m.group_id);

        // Get groups with upcoming meetings
        const { data: groups, error: groupsError } = await supabase
            .from('study_groups')
            .select('*')
            .in('id', groupIds)
            .gte('meeting_schedule', now.toISOString())
            .lte('meeting_schedule', futureDate.toISOString())
            .order('meeting_schedule', { ascending: true });

        if (groupsError) throw groupsError;

        const events: CalendarEvent[] = await Promise.all(
            (groups || []).map(async (group: any) => {
                const { count } = await supabase
                    .from('group_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('group_id', group.id);

                return {
                    id: group.id,
                    groupId: group.id,
                    title: group.subject,
                    description: group.description,
                    startDate: new Date(group.meeting_schedule),
                    location: group.meeting_location,
                    isCreator: group.creator_id === user.id,
                    memberCount: count || 0,
                    maxCapacity: group.max_capacity,
                };
            })
        );

        return events;
    } catch (error) {
        console.error('Error fetching upcoming meetings:', error);
        return [];
    }
};

/**
 * Request calendar permissions
 */
export const requestCalendarPermissions = async (): Promise<CalendarPermissions> => {
    try {
        const { status, canAskAgain } = await Calendar.requestCalendarPermissionsAsync();
        return {
            granted: status === 'granted',
            canAskAgain,
        };
    } catch (error) {
        console.error('Error requesting calendar permissions:', error);
        return { granted: false, canAskAgain: false };
    }
};

/**
 * Get calendar permissions status
 */
export const getCalendarPermissions = async (): Promise<CalendarPermissions> => {
    try {
        const { status, canAskAgain } = await Calendar.getCalendarPermissionsAsync();
        return {
            granted: status === 'granted',
            canAskAgain,
        };
    } catch (error) {
        console.error('Error getting calendar permissions:', error);
        return { granted: false, canAskAgain: false };
    }
};

/**
 * Get default calendar ID
 */
const getDefaultCalendarId = async (): Promise<string | null> => {
    try {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

        // Find the default calendar
        const defaultCalendar = calendars.find((cal) => {
            if (Platform.OS === 'ios') {
                return cal.allowsModifications && cal.source?.name === 'Default';
            } else {
                return cal.accessLevel === 'owner' && cal.isPrimary;
            }
        });

        if (defaultCalendar) {
            return defaultCalendar.id;
        }

        // Fallback to first writable calendar
        const writableCalendar = calendars.find((cal) => cal.allowsModifications);
        return writableCalendar?.id || null;
    } catch (error) {
        console.error('Error getting default calendar:', error);
        return null;
    }
};

/**
 * Export event to device calendar
 */
export const exportToDeviceCalendar = async (
    event: CalendarEvent
): Promise<ExportToCalendarResult> => {
    try {
        // Check permissions
        const permissions = await requestCalendarPermissions();
        if (!permissions.granted) {
            return {
                success: false,
                error: 'Calendar permission not granted',
            };
        }

        // Get default calendar
        const calendarId = await getDefaultCalendarId();
        if (!calendarId) {
            return {
                success: false,
                error: 'No writable calendar found',
            };
        }

        // Calculate end date (default 1 hour meeting)
        const endDate = new Date(event.startDate);
        endDate.setHours(endDate.getHours() + 1);

        // Create event details
        const eventDetails = {
            title: `Study Group: ${event.title}`,
            startDate: event.startDate,
            endDate: endDate,
            location: event.location,
            notes: event.description,
            alarms: [{ relativeOffset: -30 }], // 30 minutes before
        };

        // Create the event
        const eventId = await Calendar.createEventAsync(calendarId, eventDetails as any);

        return {
            success: true,
            eventId,
        };
    } catch (error) {
        console.error('Error exporting to calendar:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to export to calendar',
        };
    }
};

/**
 * Check if event already exists in device calendar
 */
export const checkEventExists = async (
    event: CalendarEvent
): Promise<boolean> => {
    try {
        const permissions = await getCalendarPermissions();
        if (!permissions.granted) return false;

        const startDate = new Date(event.startDate);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);

        const existingEvents = await Calendar.getEventsAsync(
            [], // All calendars
            startDate,
            endDate
        );

        return existingEvents.some(
            (e) => e.title?.includes(event.title) && 
                   e.location === event.location
        );
    } catch (error) {
        console.error('Error checking event exists:', error);
        return false;
    }
};
