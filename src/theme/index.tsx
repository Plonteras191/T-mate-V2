// Theme barrel export
export { colors } from './colors';
export type { Colors } from './colors';

export { fontSizes, fontWeights, lineHeights, typography } from './typography';
export type { FontSizes, FontWeights, LineHeights, Typography } from './typography';

export { spacing, borderRadius, shadows } from './spacing';
export type { Spacing, BorderRadius, Shadows } from './spacing';

// Combined theme object for convenience
import { colors } from './colors';
import { fontSizes, fontWeights, lineHeights, typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const theme = {
    colors,
    fontSizes,
    fontWeights,
    lineHeights,
    typography,
    spacing,
    borderRadius,
    shadows,
} as const;

export type Theme = typeof theme;
