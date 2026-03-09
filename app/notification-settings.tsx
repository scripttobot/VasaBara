import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '@/lib/theme-context';

const PREFS_KEY = '@bashvara_notification_prefs';

interface NotificationPrefs {
  messages: boolean;
  newProperty: boolean;
  kycStatus: boolean;
  system: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  messages: true,
  newProperty: true,
  kycStatus: true,
  system: true,
};

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then(val => {
      if (val) setPrefs(JSON.parse(val));
    });
  }, []);

  const updatePref = async (key: keyof NotificationPrefs, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(updated));
  };

  const items = [
    { key: 'messages' as const, icon: 'chatbubble-outline' as const, label: 'মেসেজ নোটিফিকেশন', desc: 'নতুন মেসেজ এলে জানাবে' },
    { key: 'newProperty' as const, icon: 'home-outline' as const, label: 'নতুন প্রপার্টি', desc: 'নতুন প্রপার্টি যোগ হলে জানাবে' },
    { key: 'kycStatus' as const, icon: 'shield-checkmark-outline' as const, label: 'KYC স্ট্যাটাস', desc: 'KYC অনুমোদন/প্রত্যাখ্যান হলে জানাবে' },
    { key: 'system' as const, icon: 'notifications-outline' as const, label: 'সিস্টেম নোটিফিকেশন', desc: 'গুরুত্বপূর্ণ আপডেট ও ঘোষণা' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0), backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>নোটিফিকেশন সেটিংস</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {items.map(item => (
          <View key={item.key} style={[styles.row, { borderBottomColor: colors.borderLight }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              <Text style={[styles.rowDesc, { color: colors.textMuted }]}>{item.desc}</Text>
            </View>
            <Switch
              value={prefs[item.key]}
              onValueChange={(val) => updatePref(item.key, val)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={prefs[item.key] ? colors.primary : '#ccc'}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  content: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  rowDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});
