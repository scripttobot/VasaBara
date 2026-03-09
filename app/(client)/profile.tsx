import React from 'react';
import { View, Text, ScrollView, Platform, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { useTheme, useColors } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, savedProperties, logout } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: async () => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleMenuPress = (label: string) => {
    switch (label) {
      case t('editProfile'):
        router.push('/edit-profile');
        break;
      case t('notificationSettings'):
        router.push('/notification-settings');
        break;
      case t('privacy'):
        router.push('/privacy');
        break;
      case t('changeLanguage'):
        setLanguage(language === 'bn' ? 'en' : 'bn');
        break;
      case t('helpCenter'):
        router.push('/help-center');
        break;
      case t('terms'):
        router.push('/terms');
        break;
      case t('aboutApp'):
        router.push('/about');
        break;
    }
  };

  const menuItems = [
    { icon: 'person-outline' as const, label: t('editProfile'), color: colors.primary },
    { icon: 'notifications-outline' as const, label: t('notificationSettings'), color: colors.secondary },
    { icon: 'shield-checkmark-outline' as const, label: t('privacy'), color: colors.success },
    { icon: 'language-outline' as const, label: t('changeLanguage'), color: '#8B5CF6', subtitle: language === 'bn' ? 'বাংলা' : 'English' },
    { icon: 'moon-outline' as const, label: t('darkMode'), color: '#6366F1', toggle: true },
    { icon: 'help-circle-outline' as const, label: t('helpCenter'), color: colors.accent },
    { icon: 'document-text-outline' as const, label: t('terms'), color: colors.textSecondary },
    { icon: 'information-circle-outline' as const, label: t('aboutApp'), color: colors.textMuted },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20),
            paddingBottom: 30,
            paddingHorizontal: 24,
            alignItems: 'center',
          }}
        >
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' }}>
            <Ionicons name="person" size={38} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: '#FFFFFF' }}>{user?.name || 'ব্যবহারকারী'}</Text>
          <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{user?.email || ''}</Text>
          {user?.phone ? (
            <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{user.phone}</Text>
          ) : null}
        </LinearGradient>

        <View style={{
          flexDirection: 'row',
          backgroundColor: colors.card,
          marginHorizontal: 24,
          marginTop: -16,
          padding: 18,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          justifyContent: 'center',
        }}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Text style={{ fontSize: 22, fontFamily: 'Inter_700Bold', color: colors.primary }}>{savedProperties.length}</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textSecondary }}>{t('saved')}</Text>
          </View>
        </View>

        <View style={{
          backgroundColor: colors.card,
          marginHorizontal: 24,
          marginTop: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
        }}>
          {menuItems.map((item, index) => (
            <AnimatedPressable
              key={index}
              onPress={() => item.toggle ? undefined : handleMenuPress(item.label)}
              style={{
                flexDirection: 'row' as const,
                alignItems: 'center' as const,
                paddingHorizontal: 16,
                paddingVertical: 14,
                gap: 12,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: colors.borderLight,
              }}
              scaleValue={0.98}
              haptic={false}
            >
              <LinearGradient
                colors={[item.color + '25', item.color + '10']}
                style={{ width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: 'Inter_500Medium', color: colors.textPrimary }}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textSecondary, marginTop: 1 }}>{item.subtitle}</Text>
                )}
              </View>
              {item.toggle ? (
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={isDark ? colors.primary : colors.border}
                />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </AnimatedPressable>
          ))}
        </View>

        <AnimatedPressable
          onPress={handleLogout}
          style={{
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            gap: 8,
            marginHorizontal: 24,
            marginTop: 20,
            padding: 16,
            borderRadius: 14,
            backgroundColor: colors.dangerLight,
            borderWidth: 1,
            borderColor: colors.danger + '30',
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={{ fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.danger }}>{t('logout')}</Text>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}
