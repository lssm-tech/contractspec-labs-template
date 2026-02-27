'use client';

export interface ColorTokens {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  ring: string;
}

export interface RadiusTokens {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface SpaceTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface TypographyTokens {
  h1: number;
  h2: number;
  h3: number;
  body: number;
  small: number;
}

export interface ThemeTokens {
  colors: ColorTokens;
  radii: RadiusTokens;
  space: SpaceTokens;
  typography: TypographyTokens;
  icons: { sm: number; md: number; lg: number };
}

export const defaultTokens: ThemeTokens = {
  colors: {
    background: '#fafaf8',
    foreground: '#1a1917',
    muted: '#f6f5f3',
    mutedForeground: '#9c978e',
    primary: '#2c5f2d',
    primaryForeground: '#ffffff',
    accent: '#6b4fa0',
    accentForeground: '#ffffff',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    border: '#e8e6e1',
    ring: '#2c5f2d',
  },
  radii: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  typography: { h1: 30, h2: 24, h3: 20, body: 16, small: 14 },
  icons: { sm: 16, md: 20, lg: 24 },
};
