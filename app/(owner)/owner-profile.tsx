import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, Modal, Switch, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function OwnerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, getOwnerProperties } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showBusinessHours, setShowBusinessHours] = useState(false);

  const ownerProps = getOwnerProperties();
  const totalRent = useMemo(() => ownerProps.reduce((sum, p) => sum + (p.available ? p.rent : 0), 0), [ownerProps]);

  const handleLogout = () => {
    Alert.alert('লগআউট', 'আপনি কি লগআউট করতে চান?', [
      { text: 'না', style: 'cancel' },
      {
        text: 'হ্যাঁ', style: 'destructive', onPress: async () => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  const handleMenuPress = (label: string) => {
    switch (label) {
      case 'edit_profile': router.push('/edit-profile'); break;
      case 'kyc':
        Alert.alert('KYC ভেরিফিকেশন', user?.kycVerified
          ? 'আপনার KYC ভেরিফাই করা হয়েছে।'
          : 'KYC ভেরিফিকেশন প্রক্রিয়াধীন। অনুগ্রহ করে অপেক্ষা করুন।');
        break;
      case 'payment': setShowPayment(true); break;
      case 'earnings': setShowEarnings(true); break;
      case 'notifications': router.push('/notification-settings'); break;
      case 'business_hours': setShowBusinessHours(true); break;
      case 'privacy': router.push('/privacy'); break;
      case 'help': router.push('/help-center'); break;
      case 'about': router.push('/about'); break;
    }
  };

  const menuItems = [
    { id: 'edit_profile', icon: 'person-outline' as const, label: 'প্রোফাইল সম্পাদনা', color: Colors.secondary },
    { id: 'kyc', icon: 'shield-checkmark-outline' as const, label: 'KYC ভেরিফিকেশন', color: Colors.success },
    { id: 'payment', icon: 'wallet-outline' as const, label: 'পেমেন্ট মেথড', color: '#8B5CF6' },
    { id: 'earnings', icon: 'bar-chart-outline' as const, label: 'আর্নিং রিপোর্ট', color: Colors.primary },
    { id: 'notifications', icon: 'notifications-outline' as const, label: 'নোটিফিকেশন', color: Colors.accent },
    { id: 'business_hours', icon: 'time-outline' as const, label: 'বিজনেস আওয়ারস', color: '#6366F1' },
    { id: 'privacy', icon: 'lock-closed-outline' as const, label: 'প্রাইভেসি', color: '#0EA5E9' },
    { id: 'help', icon: 'help-circle-outline' as const, label: 'সাহায্য', color: Colors.textSecondary },
    { id: 'about', icon: 'information-circle-outline' as const, label: 'অ্যাপ সম্পর্কে', color: '#64748B' },
  ];

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={[s.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <Text style={s.headerTitle}>প্রোফাইল</Text>
        </View>

        <View style={s.profileCard}>
          <View style={s.avatarLarge}>
            <Text style={s.avatarText}>{(user?.name || 'O').charAt(0).toUpperCase()}</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>{user?.name || 'বাড়িওয়ালা'}</Text>
            <Text style={s.profileEmail}>{user?.email || ''}</Text>
            <View style={s.kycRow}>
              <Ionicons name={user?.kycVerified ? 'checkmark-circle' : 'time-outline'} size={14} color={user?.kycVerified ? Colors.success : Colors.accent} />
              <Text style={[s.kycText, { color: user?.kycVerified ? Colors.success : Colors.accent }]}>
                {user?.kycVerified ? 'KYC Verified' : 'KYC Pending'}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{ownerProps.length}</Text>
            <Text style={s.statLabel}>প্রপার্টি</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statValue}>{ownerProps.filter(p => p.available).length}</Text>
            <Text style={s.statLabel}>ভাড়ার জন্য</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statValue, { color: Colors.primary }]}>৳{totalRent.toLocaleString('bn-BD')}</Text>
            <Text style={s.statLabel}>মোট ভাড়া</Text>
          </View>
        </View>

        <View style={s.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [s.menuItem, pressed && { backgroundColor: '#F8F9FA' }, index === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={[s.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.9 }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={s.logoutText}>লগআউট</Text>
        </Pressable>
      </ScrollView>

      <PaymentMethodModal visible={showPayment} onClose={() => setShowPayment(false)} insets={insets} />
      <EarningsModal visible={showEarnings} onClose={() => setShowEarnings(false)} insets={insets} ownerProps={ownerProps} totalRent={totalRent} />
      <BusinessHoursModal visible={showBusinessHours} onClose={() => setShowBusinessHours(false)} insets={insets} />
    </View>
  );
}

function PaymentMethodModal({ visible, onClose, insets }: { visible: boolean; onClose: () => void; insets: any }) {
  const [bkash, setBkash] = useState('');
  const [nagad, setNagad] = useState('');
  const [bank, setBank] = useState('');
  const handleSave = () => {
    Alert.alert('সফল', 'পেমেন্ট মেথড সেভ করা হয়েছে');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]} onStartShouldSetResponder={() => true}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>পেমেন্ট মেথড</Text>

          <View style={s.paymentItem}>
            <View style={[s.paymentIcon, { backgroundColor: '#E91E8C15' }]}>
              <Ionicons name="phone-portrait-outline" size={22} color="#E91E8C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.paymentLabel}>বিকাশ</Text>
              <TextInput style={s.paymentInput} placeholder="01XXXXXXXXX" placeholderTextColor={Colors.textMuted} value={bkash} onChangeText={setBkash} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={s.paymentItem}>
            <View style={[s.paymentIcon, { backgroundColor: '#F2711715' }]}>
              <Ionicons name="phone-portrait-outline" size={22} color="#F27117" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.paymentLabel}>নগদ</Text>
              <TextInput style={s.paymentInput} placeholder="01XXXXXXXXX" placeholderTextColor={Colors.textMuted} value={nagad} onChangeText={setNagad} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={s.paymentItem}>
            <View style={[s.paymentIcon, { backgroundColor: '#0A8F7F15' }]}>
              <Ionicons name="card-outline" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.paymentLabel}>ব্যাংক অ্যাকাউন্ট</Text>
              <TextInput style={s.paymentInput} placeholder="অ্যাকাউন্ট নম্বর" placeholderTextColor={Colors.textMuted} value={bank} onChangeText={setBank} />
            </View>
          </View>

          <Pressable style={s.sheetBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={s.sheetBtnText}>সেভ করুন</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function EarningsModal({ visible, onClose, insets, ownerProps, totalRent }: { visible: boolean; onClose: () => void; insets: any; ownerProps: any[]; totalRent: number }) {
  const activeProps = ownerProps.filter((p: any) => p.available);
  const inactiveProps = ownerProps.filter((p: any) => !p.available);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]} onStartShouldSetResponder={() => true}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>আর্নিং রিপোর্ট</Text>

          <View style={s.earningsCard}>
            <Text style={s.earningsLabel}>এই মাসের সম্ভাব্য আয়</Text>
            <Text style={s.earningsValue}>৳{totalRent.toLocaleString('bn-BD')}</Text>
          </View>

          <View style={s.earningsRow}>
            <View style={[s.earningsStat, { borderRightWidth: 1, borderRightColor: '#E8ECF0' }]}>
              <Text style={s.earningsStatValue}>{activeProps.length}</Text>
              <Text style={s.earningsStatLabel}>সক্রিয় প্রপার্টি</Text>
            </View>
            <View style={s.earningsStat}>
              <Text style={s.earningsStatValue}>{inactiveProps.length}</Text>
              <Text style={s.earningsStatLabel}>নিষ্ক্রিয় প্রপার্টি</Text>
            </View>
          </View>

          {activeProps.length > 0 && (
            <View style={s.earningsList}>
              <Text style={s.earningsListTitle}>প্রপার্টি অনুযায়ী আয়</Text>
              {activeProps.map((p: any) => (
                <View key={p.id} style={s.earningsListItem}>
                  <Text style={s.earningsListName} numberOfLines={1}>{p.title}</Text>
                  <Text style={s.earningsListAmount}>৳{p.rent.toLocaleString('bn-BD')}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable style={[s.sheetBtn, { backgroundColor: Colors.textSecondary }]} onPress={onClose}>
            <Text style={s.sheetBtnText}>বন্ধ করুন</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function BusinessHoursModal({ visible, onClose, insets }: { visible: boolean; onClose: () => void; insets: any }) {
  const [availableForCall, setAvailableForCall] = useState(true);
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('9:00 PM');
  const [weekendAvailable, setWeekendAvailable] = useState(false);

  const handleSave = () => {
    Alert.alert('সফল', 'বিজনেস আওয়ারস সেভ করা হয়েছে');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]} onStartShouldSetResponder={() => true}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>বিজনেস আওয়ারস</Text>

          <View style={s.bhRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.bhLabel}>কলের জন্য উপলব্ধ</Text>
              <Text style={s.bhDesc}>ভাড়াটিয়ারা আপনাকে কল করতে পারবে</Text>
            </View>
            <Switch value={availableForCall} onValueChange={setAvailableForCall} trackColor={{ false: '#E4E6EB', true: Colors.primaryLight }} thumbColor={availableForCall ? Colors.primary : '#F4F5F7'} />
          </View>

          {availableForCall && (
            <>
              <View style={s.bhTimeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.bhLabel}>শুরু</Text>
                  <TextInput style={s.bhTimeInput} value={startTime} onChangeText={setStartTime} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.bhLabel}>শেষ</Text>
                  <TextInput style={s.bhTimeInput} value={endTime} onChangeText={setEndTime} />
                </View>
              </View>

              <View style={s.bhRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.bhLabel}>শুক্র/শনিবারেও উপলব্ধ</Text>
                  <Text style={s.bhDesc}>সপ্তাহান্তে কল গ্রহণ করুন</Text>
                </View>
                <Switch value={weekendAvailable} onValueChange={setWeekendAvailable} trackColor={{ false: '#E4E6EB', true: Colors.primaryLight }} thumbColor={weekendAvailable ? Colors.primary : '#F4F5F7'} />
              </View>
            </>
          )}

          <Pressable style={s.sheetBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={s.sheetBtnText}>সেভ করুন</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#FFFFFF' },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    marginHorizontal: 16, marginTop: 14, padding: 16, borderRadius: 16,
    borderWidth: 1, borderColor: '#E8ECF0', gap: 14,
  },
  avatarLarge: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  kycRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  kycText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  statsRow: {
    flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 12,
  },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#E8ECF0',
  },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4 },

  menuSection: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 14,
    borderRadius: 16, borderWidth: 1, borderColor: '#E8ECF0', overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    gap: 12, borderBottomWidth: 0.5, borderBottomColor: '#F0F2F5',
  },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 14,
    backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: Colors.danger + '25',
  },
  logoutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.danger },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, maxHeight: '85%',
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB',
    alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary,
    textAlign: 'center', marginBottom: 20,
  },
  sheetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 48, borderRadius: 24, marginTop: 16,
  },
  sheetBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },

  paymentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#F0F2F5',
  },
  paymentIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  paymentLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, marginBottom: 4 },
  paymentInput: {
    backgroundColor: '#F8F9FA', borderRadius: 10, paddingHorizontal: 14,
    height: 40, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary,
    borderWidth: 1, borderColor: '#E8ECF0',
  },

  earningsCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  earningsLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, marginBottom: 4 },
  earningsValue: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.primary },
  earningsRow: { flexDirection: 'row', marginBottom: 16 },
  earningsStat: { flex: 1, alignItems: 'center', padding: 12 },
  earningsStatValue: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  earningsStatLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4 },
  earningsList: { gap: 8 },
  earningsListTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, marginBottom: 4 },
  earningsListItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#F8F9FA',
    borderRadius: 10, borderWidth: 1, borderColor: '#E8ECF0',
  },
  earningsListName: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, marginRight: 12 },
  earningsListAmount: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.primary },

  bhRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#F0F2F5',
  },
  bhLabel: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  bhDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },
  bhTimeRow: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  bhTimeInput: {
    backgroundColor: '#F8F9FA', borderRadius: 10, paddingHorizontal: 14,
    height: 44, fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary,
    borderWidth: 1, borderColor: '#E8ECF0', marginTop: 6,
  },
});
