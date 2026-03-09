import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, savedProperties, logout } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const bgColor = isDark ? '#121212' : Colors.background;
  const cardBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#E0E0E0' : Colors.textPrimary;
  const textSecColor = isDark ? '#999999' : Colors.textSecondary;
  const borderColor = isDark ? '#333333' : Colors.border;

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: async () => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace('/');
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
    { icon: 'person-outline' as const, label: t('editProfile'), color: Colors.primary },
    { icon: 'notifications-outline' as const, label: t('notificationSettings'), color: Colors.secondary },
    { icon: 'shield-checkmark-outline' as const, label: t('privacy'), color: Colors.success },
    { icon: 'language-outline' as const, label: t('changeLanguage'), color: '#8B5CF6', subtitle: language === 'bn' ? 'বাংলা' : 'English' },
    { icon: 'moon-outline' as const, label: t('darkMode'), color: '#6366F1', toggle: true },
    { icon: 'help-circle-outline' as const, label: t('helpCenter'), color: Colors.accent },
    { icon: 'document-text-outline' as const, label: t('terms'), color: Colors.textSecondary },
    { icon: 'information-circle-outline' as const, label: t('aboutApp'), color: Colors.textMuted },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), backgroundColor: cardBg }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>{t('profile')}</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={36} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textColor }]}>{user?.name || 'ব্যবহারকারী'}</Text>
            <Text style={[styles.profileEmail, { color: textSecColor }]}>{user?.email || ''}</Text>
            <Text style={[styles.profilePhone, { color: textSecColor }]}>{user?.phone || ''}</Text>
          </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: textColor }]}>{savedProperties.length}</Text>
            <Text style={[styles.statLabel, { color: textSecColor }]}>{t('saved')}</Text>
          </View>
        </View>

        <View style={[styles.menuSection, { backgroundColor: cardBg, borderColor }]}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: isDark ? '#2A2A2A' : Colors.inputBg }, { borderBottomColor: isDark ? '#333' : Colors.borderLight }]}
              onPress={() => item.toggle ? undefined : handleMenuPress(item.label)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuLabel, { color: textColor }]}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: textSecColor, marginTop: 1 }}>{item.subtitle}</Text>
                )}
              </View>
              {item.toggle ? (
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                  thumbColor={isDark ? Colors.primary : '#ccc'}
                />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={isDark ? '#666' : Colors.textMuted} />
              )}
            </Pressable>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.9 }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 12, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    marginHorizontal: 24, marginTop: 16, padding: 18, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 14,
  },
  avatarLarge: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  profilePhone: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 24, marginTop: 12,
    padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    justifyContent: 'center',
  },
  statItem: { alignItems: 'center', gap: 2 },
  statNumber: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  statLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  menuSection: {
    backgroundColor: '#FFFFFF', marginHorizontal: 24, marginTop: 16,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 24, marginTop: 20, padding: 16, borderRadius: 14,
    backgroundColor: Colors.dangerLight, borderWidth: 1, borderColor: Colors.danger + '30',
  },
  logoutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.danger },
});
