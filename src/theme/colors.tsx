// Theme Colors for Study Group Finder
// Primary: Indigo, clean and modern design

export const colors = {
    // Primary colors
    primary: {
        main: '#4F46E5',
        light: '#818CF8',
        dark: '#3730A3',
        contrast: '#FFFFFF',
    },

    // Secondary colors
    secondary: {
        main: '#6B7280',
        light: '#9CA3AF',
        dark: '#4B5563',
        contrast: '#FFFFFF',
    },

    // Status colors
    success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
        contrast: '#FFFFFF',
    },

    danger: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
        contrast: '#FFFFFF',
    },

    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
        contrast: '#000000',
    },

    // Background colors
    background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
    },

    // Surface colors
    surface: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        elevated: '#FFFFFF',
    },

    // Text colors
    text: {
        primary: '#111827',
        secondary: '#6B7280',
        tertiary: '#9CA3AF',
        inverse: '#FFFFFF',
        disabled: '#D1D5DB',
    },

    // Border colors
    border: {
        light: '#E5E7EB',
        medium: '#D1D5DB',
        dark: '#9CA3AF',
        focus: '#4F46E5',
        error: '#EF4444',
    },

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Transparent
    transparent: 'transparent',
} as const;

export type Colors = typeof colors;
