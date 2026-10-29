export const themes = {
  light: {
    mode: 'light' as const,
    background: '#F7F5F0',
    surface: '#FFFEFA',
    surfaceMuted: '#F0EDE6',
    text: '#111111',
    textMuted: '#57534E',
    accent: '#111111',
    accentText: '#FFFEFA',
    border: '#DED9CF',
    success: '#176B45',
    warning: '#8B5A00',
    danger: '#A52828',
    field: '#FFFEFA',
  },
  dark: {
    mode: 'dark' as const,
    background: '#101010',
    surface: '#191919',
    surfaceMuted: '#242424',
    text: '#FF8A00',
    textMuted: '#FDBA74',
    accent: '#FF8A00',
    accentText: '#101010',
    border: '#383027',
    success: '#FFB45D',
    warning: '#FFB45D',
    danger: '#FF9B91',
    field: '#191919',
  },
};

export type ThemeMode = keyof typeof themes;
export type ThemeColors = (typeof themes)[ThemeMode];
