import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: 'লগইন' }} />
      <Stack.Screen name="register-client" options={{ title: 'ভাড়াটিয়া রেজিস্ট্রেশন' }} />
      <Stack.Screen name="register-owner" options={{ title: 'বাড়িওয়ালা রেজিস্ট্রেশন' }} />
    </Stack>
  );
}
