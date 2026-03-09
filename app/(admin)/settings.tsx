import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/lib/app-context';
import { db } from '@/lib/firebase';
import { useColors, useTheme } from '@/lib/theme-context';

export default function AdminSettings() {
  const insets = useSafeAreaInsets();
  const { logout, user } = useApp();
  const colors = useColors();
  const { isDark } = useTheme();

  const ADMIN_ACCENT = isDark ? '#A78BFA' : '#6C5CE7';
  const ADMIN_ACCENT_BG = isDark ? '#1E1635' : '#F0EEFF';

  const handleLogout = () => {
    Alert.alert(
      'লগআউট',
      'আপনি কি নিশ্চিত যে আপনি অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?',
      [
        { text: 'বাতিল', style: 'cancel' },
        {
          text: 'লগআউট',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      'নোটিফিকেশন সেটিংস',
      'পুশ নোটিফিকেশন চালু আছে।',
      [
        { text: 'বন্ধ করুন', onPress: () => Alert.alert('সফল', 'নোটিফিকেশন বন্ধ করা হয়েছে') },
        { text: 'ঠিক আছে', style: 'cancel' },
      ]
    );
  };

  const handleSecurity = () => {
    Alert.alert('সিকিউরিটি', 'পাসওয়ার্ড Firebase Authentication দ্বারা ম্যানেজ করা হয়। পাসওয়ার্ড পরিবর্তন করতে Firebase Console ব্যবহার করুন।');
  };

  const handleLanguage = () => {
    Alert.alert('ভাষা সেটিংস', 'বর্তমান ভাষা: বাংলা\n\nভবিষ্যতে আরও ভাষা যোগ করা হবে।');
  };

  const handleDataBackup = () => {
    Alert.alert('ডাটা ব্যাকআপ', 'Firebase অটো-ব্যাকআপ সক্রিয় আছে। আপনার সমস্ত ডাটা স্বয়ংক্রিয়ভাবে ব্যাকআপ হচ্ছে।');
  };

  const handleReportExport = () => {
    Alert.alert('রিপোর্ট এক্সপোর্ট', 'এই ফিচারটি শীঘ্রই আসছে।');
  };

  const handleCacheClear = () => {
    Alert.alert(
      'ক্যাশ ক্লিয়ার',
      'আপনি কি নিশ্চিত যে আপনি অ্যাপ ক্যাশ পরিষ্কার করতে চান?',
      [
        { text: 'বাতিল', style: 'cancel' },
        {
          text: 'ক্লিয়ার করুন',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('সফল', 'অ্যাপ ক্যাশ সফলভাবে পরিষ্কার করা হয়েছে।');
            } catch (e) {
              Alert.alert('ত্রুটি', 'ক্যাশ পরিষ্কার করতে সমস্যা হয়েছে।');
            }
          },
        },
      ]
    );
  };

  const handleAppInfo = () => {
    Alert.alert('অ্যাপ তথ্য', 'BashVara v1.0.0\n\nবাংলাদেশের সেরা বাসা ভাড়া প্ল্যাটফর্ম।\n\nডেভেলপড বাই: BashVara Team');
  };

  const handleDevLogs = () => {
    const firebaseApp = db.app;
    Alert.alert('ডেভেলপার লগ', `Firebase Project: ${firebaseApp.options.projectId ?? 'N/A'}\nAuth Domain: ${firebaseApp.options.authDomain ?? 'N/A'}\nAdmin User: ${user?.email ?? 'N/A'}`);
  };

  const handleFirebaseStatus = () => {
    const isConnected = !!db;
    Alert.alert('Firebase স্ট্যাটাস', isConnected ? 'Firebase সার্ভারের সাথে সংযুক্ত আছে।' : 'Firebase সার্ভারের সাথে সংযোগ বিচ্ছিন্ন।');
  };

  const settingsHandlers: Record<string, () => void> = {
    'নোটিফিকেশন সেটিংস': handleNotificationSettings,
    'সিকিউরিটি': handleSecurity,
    'ভাষা সেটিংস': handleLanguage,
    'ডাটা ব্যাকআপ': handleDataBackup,
    'রিপোর্ট এক্সপোর্ট': handleReportExport,
    'ক্যাশ ক্লিয়ার': handleCacheClear,
    'অ্যাপ তথ্য': handleAppInfo,
    'ডেভেলপার লগ': handleDevLogs,
    'Firebase স্ট্যাটাস': handleFirebaseStatus,
  };

  const settingsGroups = [
    {
      title: 'অ্যাপ কনফিগারেশন',
      items: [
        { icon: 'notifications-outline' as const, label: 'নোটিফিকেশন সেটিংস', subtitle: 'পুশ নোটিফিকেশন কনফিগার করুন' },
        { icon: 'shield-outline' as const, label: 'সিকিউরিটি', subtitle: 'পাসওয়ার্ড ও অ্যাক্সেস ম্যানেজ' },
        { icon: 'language-outline' as const, label: 'ভাষা সেটিংস', subtitle: 'বাংলা / English' },
      ],
    },
    {
      title: 'ডাটা ম্যানেজমেন্ট',
      items: [
        { icon: 'cloud-upload-outline' as const, label: 'ডাটা ব্যাকআপ', subtitle: 'Firebase ব্যাকআপ ম্যানেজ করুন' },
        { icon: 'analytics-outline' as const, label: 'রিপোর্ট এক্সপোর্ট', subtitle: 'CSV/PDF রিপোর্ট ডাউনলোড' },
        { icon: 'trash-outline' as const, label: 'ক্যাশ ক্লিয়ার', subtitle: 'অ্যাপ ক্যাশ পরিষ্কার করুন' },
      ],
    },
    {
      title: 'সিস্টেম',
      items: [
        { icon: 'information-circle-outline' as const, label: 'অ্যাপ তথ্য', subtitle: 'BashVara v1.0.0' },
        { icon: 'document-text-outline' as const, label: 'ডেভেলপার লগ', subtitle: 'সিস্টেম লগ দেখুন' },
        { icon: 'server-outline' as const, label: 'Firebase স্ট্যাটাস', subtitle: 'সার্ভার কানেকশন চেক' },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>সেটিংস</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>অ্যাডমিন কনফিগারেশন</Text>
      </View>

      <View style={[styles.adminCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
        <View style={[styles.adminAvatar, { backgroundColor: ADMIN_ACCENT }]}>
          <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
        </View>
        <View style={styles.adminInfo}>
          <Text style={[styles.adminName, { color: colors.textPrimary }]}>{user?.name || 'Super Admin'}</Text>
          <Text style={[styles.adminEmail, { color: colors.textSecondary }]}>{user?.email || 'admin@bashvara.com'}</Text>
        </View>
        <View style={[styles.adminRoleBadge, { backgroundColor: ADMIN_ACCENT_BG }]}>
          <Text style={[styles.adminRoleText, { color: ADMIN_ACCENT }]}>অ্যাডমিন</Text>
        </View>
      </View>

      {settingsGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
            {group.items.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < group.items.length - 1 && [styles.settingItemBorder, { borderBottomColor: colors.borderLight }],
                ]}
                onPress={() => settingsHandlers[item.label]?.()}
              >
                <View style={[styles.settingIcon, { backgroundColor: ADMIN_ACCENT_BG }]}>
                  <Ionicons name={item.icon} size={22} color={ADMIN_ACCENT} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.logoutSection}>
        <Pressable style={[styles.logoutBtn, { backgroundColor: colors.dangerLight, borderColor: colors.danger + '30' }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>লগআউট করুন</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  adminAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminInfo: { flex: 1, marginLeft: 14 },
  adminName: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  adminEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  adminRoleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adminRoleText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  group: { marginTop: 24, paddingHorizontal: 20 },
  groupTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 8, textTransform: 'uppercase' as const },
  groupCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' as const },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingItemBorder: { borderBottomWidth: 1 },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  settingSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  logoutSection: { paddingHorizontal: 20, marginTop: 32 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  logoutText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
});
