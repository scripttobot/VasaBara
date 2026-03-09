import { Stack } from 'expo-router';
import { useColors } from '@/lib/theme-context';

export default function AuthLayout() {
  const colors = useColors();

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors.textPrimary },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'লগইন' }} />
      <Stack.Screen name="register-client" options={{ title: 'ভাড়াটিয়া রেজিস্ট্রেশন' }} />
      <Stack.Screen name="register-owner" options={{ title: 'বাড়িওয়ালা রেজিস্ট্রেশন' }} />
    </Stack>
  );
}
