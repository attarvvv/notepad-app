import { Platform } from 'react-native';

export const theme = {
  colors: {
    background: '#000000',
    backgroundAlt: '#121212',
    surface: '#1C1C1E',
    surfaceSubtle: '#2C2C2E',
    surfaceHighlight: '#3A3A3C',
    primary: '#EBB338', // Authentic Apple Notes gold/yellow
    primaryHover: '#D49D2F',
    primaryLight: 'rgba(235, 179, 56, 0.15)',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93', // iOS Notes gray secondary text
    textMuted: '#636366',
    border: '#2C2C2E',
    borderFocus: '#EBB338',
    divider: '#1C1C1E',
    danger: '#FF453A',
    dangerLight: 'rgba(255, 69, 58, 0.18)',
    success: '#30D158',
    white: '#FFFFFF',
    black: '#000000',
    toolbar: 'rgba(18, 18, 18, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.75)',
  },
  typography: {
    largeTitle: {
      fontSize: 34,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      letterSpacing: 0.35,
    },
    noteTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      lineHeight: 34,
      letterSpacing: -0.4,
    },
    titleLarge: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      letterSpacing: -0.5,
    },
    titleMedium: {
      fontSize: 17,
      fontWeight: '600' as const,
      color: '#FFFFFF',
      letterSpacing: -0.2,
    },
    titleSmall: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: '#FFFFFF',
    },
    bodyLarge: {
      fontSize: 17,
      fontWeight: '400' as const,
      color: '#FFFFFF',
      lineHeight: 25,
      letterSpacing: -0.2,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: '#FFFFFF',
      lineHeight: 21,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '400' as const,
      color: '#8E8E93',
      lineHeight: 18,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: '#8E8E93',
    },
    timestamp: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: '#8E8E93',
      textAlign: 'center' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 10,
      elevation: 5,
    },
  },
};

export type Theme = typeof theme;
