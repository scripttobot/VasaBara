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
  primary: '#0D7C6E',
  primaryDark: '#095E54',
  primaryLight: '#E6F5F2',
  secondary: '#E8603C',
  secondaryLight: '#FEF0EB',
  accent: '#E5A100',
  accentLight: '#FFF8E1',
  danger: '#D63031',
  dangerLight: '#FDECEA',
  success: '#2E8B57',
  successLight: '#EDF7F0',
  background: '#FAFBFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#EDF2F7',
  textPrimary: '#1B2430',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  shadow: 'rgba(15, 23, 42, 0.06)',
  overlay: 'rgba(15, 23, 42, 0.45)',
  inputBg: '#F1F5F9',
  tabActive: '#0D7C6E',
  tabInactive: '#94A3B8',
  tabBarBg: '#FFFFFF',
  primaryGradient: ['#0D7C6E', '#11A692'],
  secondaryGradient: ['#E8603C', '#F28B6D'],
  backgroundGradient: ['#F0F9F7', '#FAFBFC', '#FFF7F3'],
  cardGradient: ['#FFFFFF', '#FAFBFC'],
  headerGradient: ['#0D7C6E', '#11A692'],
};

const darkColors: ThemeColors = {
  primary: '#14C6A8',
  primaryDark: '#0D9B84',
  primaryLight: '#0E2924',
  secondary: '#F28B6D',
  secondaryLight: '#281813',
  accent: '#F5C542',
  accentLight: '#28220E',
  danger: '#F56565',
  dangerLight: '#281313',
  success: '#48BB78',
  successLight: '#0E281A',
  background: '#0C0C12',
  surface: '#161622',
  card: '#1C1C2C',
  border: '#282840',
  borderLight: '#212136',
  textPrimary: '#EEEEF5',
  textSecondary: '#8B95A8',
  textMuted: '#5A6478',
  textInverse: '#0C0C12',
  shadow: 'rgba(0, 0, 0, 0.35)',
  overlay: 'rgba(0, 0, 0, 0.65)',
  inputBg: '#212136',
  tabActive: '#14C6A8',
  tabInactive: '#5A6478',
  tabBarBg: '#161622',
  primaryGradient: ['#0D9B84', '#14C6A8'],
  secondaryGradient: ['#E8603C', '#F28B6D'],
  backgroundGradient: ['#0C0C12', '#12121E', '#161622'],
  cardGradient: ['#1C1C2C', '#212136'],
  headerGradient: ['#083832', '#0D7C6E'],
};

export function getColors(isDark: boolean): ThemeColors {
  return isDark ? darkColors : lightColors;
}

const Colors = {
  ...lightColors,
  light: {
    text: '#1B2430',
    background: '#FAFBFC',
    tint: '#0D7C6E',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#0D7C6E',
  },
};

export default Colors;
