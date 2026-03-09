import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, savedProperties, logout } = useApp();

  const handleLogout = () => {
    Alert.alert('লগআউট', 'আপনি কি লগআউট করতে চান?', [
      { text: 'না', style: 'cancel' },
      {
        text: 'হ্যাঁ',
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
      case 'প্রোফাইল সম্পাদনা':
        router.push('/edit-profile');
        break;
      case 'নোটিফিকেশন সেটিংস':
        Alert.alert('নোটিফিকেশন', 'নোটিফিকেশন সেটিংস শীঘ্রই আসছে');
        break;
      case 'গোপনীয়তা':
        Alert.alert('গোপনীয়তা', 'আপনার তথ্য সম্পূর্ণ সুরক্ষিত। আমরা Firebase Authentication ও Firestore ব্যবহার করি।');
        break;
      case 'ভাষা পরিবর্তন':
        Alert.alert('ভাষা', 'বর্তমান ভাষা: বাংলা');
        break;
      case 'ডার্ক মোড':
        Alert.alert('ডার্ক মোড', 'এই ফিচার শীঘ্রই আসছে');
        break;
      case 'সাহায্য কেন্দ্র':
        Alert.alert('সাহায্য', 'BashVara - বাংলাদেশের ভাড়া বাড়ি খোঁজার অ্যাপ।\n\nসমস্যা হলে support@bashvara.com এ যোগাযোগ করুন।');
        break;
      case 'শর্তাবলী':
        Alert.alert('শর্তাবলী', 'BashVara ব্যবহার করে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন। ভাড়াটিয়া ও বাড়িওয়ালা উভয়ই তাদের দেওয়া তথ্যের জন্য দায়ী।');
        break;
      case 'অ্যাপ সম্পর্কে':
        Alert.alert('অ্যাপ সম্পর্কে', 'BashVara (বাসভাড়া)\nসংস্করণ: 1.0.0\n\nবাংলাদেশের ভাড়া বাসা খোঁজার সেরা প্ল্যাটফর্ম');
        break;
    }
  };

  const menuItems = [
    { icon: 'person-outline' as const, label: 'প্রোফাইল সম্পাদনা', color: Colors.primary },
    { icon: 'notifications-outline' as const, label: 'নোটিফিকেশন সেটিংস', color: Colors.secondary },
    { icon: 'shield-checkmark-outline' as const, label: 'গোপনীয়তা', color: Colors.success },
    { icon: 'language-outline' as const, label: 'ভাষা পরিবর্তন', color: '#8B5CF6' },
    { icon: 'moon-outline' as const, label: 'ডার্ক মোড', color: '#6366F1' },
    { icon: 'help-circle-outline' as const, label: 'সাহায্য কেন্দ্র', color: Colors.accent },
    { icon: 'document-text-outline' as const, label: 'শর্তাবলী', color: Colors.textSecondary },
    { icon: 'information-circle-outline' as const, label: 'অ্যাপ সম্পর্কে', color: Colors.textMuted },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <Text style={styles.headerTitle}>প্রোফাইল</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={36} color={Colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'ব্যবহারকারী'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            <Text style={styles.profilePhone}>{user?.phone || ''}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{savedProperties.length}</Text>
            <Text style={styles.statLabel}>সংরক্ষিত</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: Colors.inputBg }]}
              onPress={() => handleMenuPress(item.label)}
            >
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
