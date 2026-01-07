// Spacing constants for Study Group Finder
// Base unit: 4px

const BASE_UNIT = 4;

export const spacing = {
    0: 0,
    1: BASE_UNIT * 1,      // 4px
    2: BASE_UNIT * 2,      // 8px
    3: BASE_UNIT * 3,      // 12px
    4: BASE_UNIT * 4,      // 16px
    5: BASE_UNIT * 5,      // 20px
    6: BASE_UNIT * 6,      // 24px
    8: BASE_UNIT * 8,      // 32px
    10: BASE_UNIT * 10,    // 40px
    12: BASE_UNIT * 12,    // 48px
    16: BASE_UNIT * 16,    // 64px
    20: BASE_UNIT * 20,    // 80px
    24: BASE_UNIT * 24,    // 96px
} as const;

// Border radius values
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
} as const;

// Shadow styles
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
