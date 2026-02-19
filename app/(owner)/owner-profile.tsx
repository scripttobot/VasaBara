import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function OwnerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useApp();

  const handleLogout = () => {
    Alert.alert('লগআউট', 'আপনি কি লগআউট করতে চান?', [
      { text: 'না', style: 'cancel' },
      {
        text: 'হ্যাঁ', style: 'destructive', onPress: () => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline' as const, label: 'প্রোফাইল সম্পাদনা', color: Colors.secondary },
    { icon: 'shield-checkmark-outline' as const, label: 'KYC ভেরিফিকেশন', color: Colors.success },
    { icon: 'wallet-outline' as const, label: 'পেমেন্ট মেথড', color: '#8B5CF6' },
    { icon: 'bar-chart-outline' as const, label: 'আর্নিং রিপোর্ট', color: Colors.primary },
    { icon: 'notifications-outline' as const, label: 'নোটিফিকেশন', color: Colors.accent },
    { icon: 'time-outline' as const, label: 'বিজনেস আওয়ারস', color: '#6366F1' },
    { icon: 'help-circle-outline' as const, label: 'সাহায্য', color: Colors.textSecondary },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <Text style={styles.headerTitle}>প্রোফাইল</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={36} color={Colors.secondary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'বাড়িওয়ালা'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            <View style={styles.kycRow}>
              <Ionicons name={user?.kycVerified ? 'checkmark-circle' : 'time-outline'} size={16} color={user?.kycVerified ? Colors.success : Colors.accent} />
              <Text style={[styles.kycText, { color: user?.kycVerified ? Colors.success : Colors.accent }]}>
                {user?.kycVerified ? 'KYC Verified' : 'KYC Pending'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: Colors.inputBg }]}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.9 }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>লগআউট</Text>
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
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.secondaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  kycRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  kycText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
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
