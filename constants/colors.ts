export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentLight: string;
  danger: string;
  dangerLight: string;
  success: string;
  successLight: string;
  background: string;
  surface: string;
  card: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  shadow: string;
  overlay: string;
  inputBg: string;
  tabActive: string;
  tabInactive: string;
  tabBarBg: string;
  primaryGradient: [string, string];
  secondaryGradient: [string, string];
  backgroundGradient: [string, string, string];
  cardGradient: [string, string];
  headerGradient: [string, string];
}

const lightColors: ThemeColors = {
  primary: '#0A8F7F',
  primaryDark: '#077A6C',
  primaryLight: '#E0F5F2',
  secondary: '#F26B3A',
  secondaryLight: '#FFF0EB',
  accent: '#FFB800',
  accentLight: '#FFF8E6',
  danger: '#E53E3E',
  dangerLight: '#FFF0F0',
  success: '#38A169',
  successLight: '#F0FFF4',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8ECF0',
  borderLight: '#F0F2F5',
  textPrimary: '#1A202C',
  textSecondary: '#718096',
  textMuted: '#A0AEC0',
  textInverse: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  inputBg: '#F4F5F7',
  tabActive: '#0A8F7F',
  tabInactive: '#A0AEC0',
  tabBarBg: '#FFFFFF',
  primaryGradient: ['#0A8F7F', '#0BC5A8'],
  secondaryGradient: ['#F26B3A', '#FF8F65'],
  backgroundGradient: ['#E8F8F5', '#FFFFFF', '#FFF5EE'],
  cardGradient: ['#FFFFFF', '#F9FAFB'],
  headerGradient: ['#0A8F7F', '#0BC5A8'],
};

const darkColors: ThemeColors = {
  primary: '#10B9A5',
  primaryDark: '#0A8F7F',
  primaryLight: '#112B27',
  secondary: '#FF8F65',
  secondaryLight: '#2A1A14',
  accent: '#FFD060',
  accentLight: '#2A2410',
  danger: '#FC6B6B',
  dangerLight: '#2A1414',
  success: '#4ADE80',
  successLight: '#142A1C',
  background: '#0F0F14',
  surface: '#1A1A24',
  card: '#1E1F2B',
  border: '#2D2E3F',
  borderLight: '#252636',
  textPrimary: '#F0F0F5',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverse: '#0F0F14',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  inputBg: '#252636',
  tabActive: '#10B9A5',
  tabInactive: '#6B7280',
  tabBarBg: '#1A1A24',
  primaryGradient: ['#0A8F7F', '#10B9A5'],
  secondaryGradient: ['#F26B3A', '#FF8F65'],
  backgroundGradient: ['#0F0F14', '#151520', '#1A1A24'],
  cardGradient: ['#1E1F2B', '#252636'],
  headerGradient: ['#0A3F3A', '#0A8F7F'],
};

export function getColors(isDark: boolean): ThemeColors {
  return isDark ? darkColors : lightColors;
}

const Colors = {
  ...lightColors,
  light: {
    text: '#1A202C',
    background: '#F5F7FA',
    tint: '#0A8F7F',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#0A8F7F',
  },
};

export default Colors;
