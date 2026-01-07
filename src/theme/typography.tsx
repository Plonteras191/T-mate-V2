// Typography constants for Study Group Finder

export const fontSizes = {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
} as const;

export const fontWeights = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

export const lineHeights = {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
} as const;

// Typography variants for common text styles
export const typography = {
    // Headings
    h1: {
        fontSize: fontSizes['3xl'],
        fontWeight: fontWeights.bold,
        lineHeight: fontSizes['3xl'] * lineHeights.tight,
    },
    h2: {
        fontSize: fontSizes['2xl'],
        fontWeight: fontWeights.bold,
        lineHeight: fontSizes['2xl'] * lineHeights.tight,
    },
    h3: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.xl * lineHeights.tight,
    },
    h4: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.lg * lineHeights.normal,
    },

    // Body text
    body: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.base * lineHeights.normal,
    },
    bodySmall: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.sm * lineHeights.normal,
    },
    bodyLarge: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.md * lineHeights.normal,
    },

    // Labels and captions
    label: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: fontSizes.sm * lineHeights.normal,
    },
    caption: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.normal,
        lineHeight: fontSizes.xs * lineHeights.normal,
    },

    // Buttons
    button: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.base * lineHeights.tight,
    },
    buttonSmall: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        lineHeight: fontSizes.sm * lineHeights.tight,
    },
} as const;

export type FontSizes = typeof fontSizes;
export type FontWeights = typeof fontWeights;
export type LineHeights = typeof lineHeights;
export type Typography = typeof typography;
