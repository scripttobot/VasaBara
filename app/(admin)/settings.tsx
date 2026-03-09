import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';

const ADMIN_ACCENT = '#6C5CE7';

export default function AdminSettings() {
  const insets = useSafeAreaInsets();
  const { logout } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'লগআউট',
      'আপনি কি নিশ্চিত যে আপনি অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?',
      [
        { text: 'বাতিল', style: 'cancel' },
        {
          text: 'লগআউট',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.title}>সেটিংস</Text>
        <Text style={styles.subtitle}>অ্যাডমিন কনফিগারেশন</Text>
      </View>

      <View style={styles.adminCard}>
        <View style={styles.adminAvatar}>
          <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
        </View>
        <View style={styles.adminInfo}>
          <Text style={styles.adminName}>Super Admin</Text>
          <Text style={styles.adminEmail}>admin@bashvara.com</Text>
        </View>
        <View style={styles.adminRoleBadge}>
          <Text style={styles.adminRoleText}>অ্যাডমিন</Text>
        </View>
      </View>

      {settingsGroups.map((group, groupIndex) => (
        <View key={groupIndex} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.groupCard}>
            {group.items.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                style={[
                  styles.settingItem,
                  itemIndex < group.items.length - 1 && styles.settingItemBorder,
                ]}
              >
                <View style={styles.settingIcon}>
                  <Ionicons name={item.icon} size={22} color={ADMIN_ACCENT} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.logoutSection}>
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
          <Text style={styles.logoutText}>লগআউট করুন</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  adminAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ADMIN_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminInfo: { flex: 1, marginLeft: 14 },
  adminName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  adminEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  adminRoleBadge: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adminRoleText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: ADMIN_ACCENT },
  group: { marginTop: 24, paddingHorizontal: 20 },
  groupTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' as const },
  groupCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  settingSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 1 },
  logoutSection: { paddingHorizontal: 20, marginTop: 32 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerLight,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  logoutText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.danger },
});
