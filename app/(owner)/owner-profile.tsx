import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, Modal, Switch, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { useTheme } from '@/lib/theme-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import * as Haptics from 'expo-haptics';

export default function OwnerProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, getOwnerProperties } = useApp();
  const { isDark, colors } = useTheme();
  const [showPayment, setShowPayment] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showBusinessHours, setShowBusinessHours] = useState(false);

  const ownerProps = getOwnerProperties();
  const totalRent = useMemo(() => ownerProps.reduce((sum, p) => sum + (p.available ? p.rent : 0), 0), [ownerProps]);

  const handleLogout = () => {
    Alert.alert('\u09B2\u0997\u0986\u0989\u099F', '\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u09B2\u0997\u0986\u0989\u099F \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u09A8?', [
      { text: '\u09A8\u09BE', style: 'cancel' },
      {
        text: '\u09B9\u09CD\u09AF\u09BE\u0981', style: 'destructive', onPress: async () => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleMenuPress = (label: string) => {
    switch (label) {
      case 'edit_profile': router.push('/edit-profile'); break;
      case 'kyc':
        Alert.alert('KYC \u09AD\u09C7\u09B0\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8', user?.kycVerified
          ? '\u0986\u09AA\u09A8\u09BE\u09B0 KYC \u09AD\u09C7\u09B0\u09BF\u09AB\u09BE\u0987 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964'
          : 'KYC \u09AD\u09C7\u09B0\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8 \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09DF\u09BE\u09A7\u09C0\u09A8\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C1\u09A8\u0964');
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
    { id: 'edit_profile', icon: 'person-outline' as const, label: '\u09AA\u09CD\u09B0\u09CB\u09AB\u09BE\u0987\u09B2 \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE', color: colors.secondary },
    { id: 'kyc', icon: 'shield-checkmark-outline' as const, label: 'KYC \u09AD\u09C7\u09B0\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8', color: colors.success },
    { id: 'payment', icon: 'wallet-outline' as const, label: '\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AE\u09C7\u09A5\u09A1', color: '#8B5CF6' },
    { id: 'earnings', icon: 'bar-chart-outline' as const, label: '\u0986\u09B0\u09CD\u09A8\u09BF\u0982 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F', color: colors.primary },
    { id: 'notifications', icon: 'notifications-outline' as const, label: '\u09A8\u09CB\u099F\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8', color: colors.accent },
    { id: 'business_hours', icon: 'time-outline' as const, label: '\u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u0986\u0993\u09DF\u09BE\u09B0\u09CD\u09B8', color: '#6366F1' },
    { id: 'privacy', icon: 'lock-closed-outline' as const, label: '\u09AA\u09CD\u09B0\u09BE\u0987\u09AD\u09C7\u09B8\u09BF', color: '#0EA5E9' },
    { id: 'help', icon: 'help-circle-outline' as const, label: '\u09B8\u09BE\u09B9\u09BE\u09AF\u09CD\u09AF', color: colors.textSecondary },
    { id: 'about', icon: 'information-circle-outline' as const, label: '\u0985\u09CD\u09AF\u09BE\u09AA \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7', color: '#64748B' },
  ];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors.headerGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}
        >
          <Text style={s.headerTitle}>{'\u09AA\u09CD\u09B0\u09CB\u09AB\u09BE\u0987\u09B2'}</Text>
        </LinearGradient>

        <View style={[s.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient
            colors={colors.secondaryGradient as [string, string]}
            style={s.avatarLarge}
          >
            <Text style={s.avatarText}>{(user?.name || 'O').charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <View style={s.profileInfo}>
            <Text style={[s.profileName, { color: colors.textPrimary }]}>{user?.name || '\u09AC\u09BE\u09A1\u09BC\u09BF\u0993\u09DF\u09BE\u09B2\u09BE'}</Text>
            <Text style={[s.profileEmail, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
            <View style={s.kycRow}>
              <Ionicons name={user?.kycVerified ? 'checkmark-circle' : 'time-outline'} size={14} color={user?.kycVerified ? colors.success : colors.accent} />
              <Text style={[s.kycText, { color: user?.kycVerified ? colors.success : colors.accent }]}>
                {user?.kycVerified ? 'KYC Verified' : 'KYC Pending'}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <LinearGradient colors={colors.cardGradient as [string, string]} style={[s.statCard, { borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.textPrimary }]}>{ownerProps.length}</Text>
            <Text style={[s.statLabel, { color: colors.textMuted }]}>{'\u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF'}</Text>
          </LinearGradient>
          <LinearGradient colors={colors.cardGradient as [string, string]} style={[s.statCard, { borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.textPrimary }]}>{ownerProps.filter(p => p.available).length}</Text>
            <Text style={[s.statLabel, { color: colors.textMuted }]}>{'\u09AD\u09BE\u09A1\u09BC\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF'}</Text>
          </LinearGradient>
          <LinearGradient colors={colors.cardGradient as [string, string]} style={[s.statCard, { borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.primary }]}>{'\u09F3'}{totalRent.toLocaleString('bn-BD')}</Text>
            <Text style={[s.statLabel, { color: colors.textMuted }]}>{'\u09AE\u09CB\u099F \u09AD\u09BE\u09A1\u09BC\u09BE'}</Text>
          </LinearGradient>
        </View>

        <View style={[s.menuSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {menuItems.map((item, index) => (
            <AnimatedPressable
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
              style={[s.menuItem, index === menuItems.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: colors.borderLight }]}
              scaleValue={0.98}
            >
              <View style={[s.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[s.menuLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </AnimatedPressable>
          ))}
        </View>

        <AnimatedPressable
          onPress={handleLogout}
          style={[s.logoutBtn, { backgroundColor: colors.dangerLight, borderColor: colors.danger + '25' }]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[s.logoutText, { color: colors.danger }]}>{'\u09B2\u0997\u0986\u0989\u099F'}</Text>
        </AnimatedPressable>
      </ScrollView>

      <PaymentMethodModal visible={showPayment} onClose={() => setShowPayment(false)} insets={insets} isDark={isDark} colors={colors} />
      <EarningsModal visible={showEarnings} onClose={() => setShowEarnings(false)} insets={insets} ownerProps={ownerProps} totalRent={totalRent} isDark={isDark} colors={colors} />
      <BusinessHoursModal visible={showBusinessHours} onClose={() => setShowBusinessHours(false)} insets={insets} isDark={isDark} colors={colors} />
    </View>
  );
}

function PaymentMethodModal({ visible, onClose, insets, isDark, colors }: { visible: boolean; onClose: () => void; insets: any; isDark: boolean; colors: any }) {
  const [bkash, setBkash] = useState('');
  const [nagad, setNagad] = useState('');
  const [bank, setBank] = useState('');
  const handleSave = () => {
    Alert.alert('\u09B8\u09AB\u09B2', '\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AE\u09C7\u09A5\u09A1 \u09B8\u09C7\u09AD \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.card }]} onStartShouldSetResponder={() => true}>
          <View style={[s.sheetHandle, { backgroundColor: colors.textMuted }]} />
          <Text style={[s.sheetTitle, { color: colors.textPrimary }]}>{'\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F \u09AE\u09C7\u09A5\u09A1'}</Text>

          <View style={[s.paymentItem, { borderBottomColor: colors.borderLight }]}>
            <View style={[s.paymentIcon, { backgroundColor: '#E91E8C15' }]}>
              <Ionicons name="phone-portrait-outline" size={22} color="#E91E8C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.paymentLabel, { color: colors.textPrimary }]}>{'\u09AC\u09BF\u0995\u09BE\u09B6'}</Text>
              <TextInput style={[s.paymentInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} placeholder="01XXXXXXXXX" placeholderTextColor={colors.textMuted} value={bkash} onChangeText={setBkash} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={[s.paymentItem, { borderBottomColor: colors.borderLight }]}>
            <View style={[s.paymentIcon, { backgroundColor: '#F2711715' }]}>
              <Ionicons name="phone-portrait-outline" size={22} color="#F27117" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.paymentLabel, { color: colors.textPrimary }]}>{'\u09A8\u0997\u09A6'}</Text>
              <TextInput style={[s.paymentInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} placeholder="01XXXXXXXXX" placeholderTextColor={colors.textMuted} value={nagad} onChangeText={setNagad} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={[s.paymentItem, { borderBottomColor: colors.borderLight }]}>
            <View style={[s.paymentIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="card-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.paymentLabel, { color: colors.textPrimary }]}>{'\u09AC\u09CD\u09AF\u09BE\u0982\u0995 \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F'}</Text>
              <TextInput style={[s.paymentInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} placeholder={'\u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A8\u09AE\u09CD\u09AC\u09B0'} placeholderTextColor={colors.textMuted} value={bank} onChangeText={setBank} />
            </View>
          </View>

          <AnimatedPressable
            onPress={handleSave}
            gradientColors={colors.primaryGradient}
            style={s.sheetBtn}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={s.sheetBtnText}>{'\u09B8\u09C7\u09AD \u0995\u09B0\u09C1\u09A8'}</Text>
          </AnimatedPressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function EarningsModal({ visible, onClose, insets, ownerProps, totalRent, isDark, colors }: { visible: boolean; onClose: () => void; insets: any; ownerProps: any[]; totalRent: number; isDark: boolean; colors: any }) {
  const activeProps = ownerProps.filter((p: any) => p.available);
  const inactiveProps = ownerProps.filter((p: any) => !p.available);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.card }]} onStartShouldSetResponder={() => true}>
          <View style={[s.sheetHandle, { backgroundColor: colors.textMuted }]} />
          <Text style={[s.sheetTitle, { color: colors.textPrimary }]}>{'\u0986\u09B0\u09CD\u09A8\u09BF\u0982 \u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F'}</Text>

          <LinearGradient colors={colors.primaryGradient as [string, string]} style={s.earningsCard}>
            <Text style={[s.earningsLabel, { color: 'rgba(255,255,255,0.8)' }]}>{'\u098F\u0987 \u09AE\u09BE\u09B8\u09C7\u09B0 \u09B8\u09AE\u09CD\u09AD\u09BE\u09AC\u09CD\u09AF \u0986\u09DF'}</Text>
            <Text style={[s.earningsValue, { color: '#FFFFFF' }]}>{'\u09F3'}{totalRent.toLocaleString('bn-BD')}</Text>
          </LinearGradient>

          <View style={[s.earningsRow, { borderColor: colors.border }]}>
            <View style={[s.earningsStat, { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={[s.earningsStatValue, { color: colors.textPrimary }]}>{activeProps.length}</Text>
              <Text style={[s.earningsStatLabel, { color: colors.textMuted }]}>{'\u09B8\u0995\u09CD\u09B0\u09BF\u09DF \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF'}</Text>
            </View>
            <View style={s.earningsStat}>
              <Text style={[s.earningsStatValue, { color: colors.textPrimary }]}>{inactiveProps.length}</Text>
              <Text style={[s.earningsStatLabel, { color: colors.textMuted }]}>{'\u09A8\u09BF\u09B7\u09CD\u0995\u09CD\u09B0\u09BF\u09DF \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF'}</Text>
            </View>
          </View>

          {activeProps.length > 0 && (
            <View style={s.earningsList}>
              <Text style={[s.earningsListTitle, { color: colors.textPrimary }]}>{'\u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF \u0985\u09A8\u09C1\u09AF\u09BE\u09DF\u09C0 \u0986\u09DF'}</Text>
              {activeProps.map((p: any) => (
                <View key={p.id} style={[s.earningsListItem, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <Text style={[s.earningsListName, { color: colors.textPrimary }]} numberOfLines={1}>{p.title}</Text>
                  <Text style={[s.earningsListAmount, { color: colors.primary }]}>{'\u09F3'}{p.rent.toLocaleString('bn-BD')}</Text>
                </View>
              ))}
            </View>
          )}

          <Pressable style={[s.sheetBtn, { backgroundColor: colors.textSecondary }]} onPress={onClose}>
            <Text style={s.sheetBtnText}>{'\u09AC\u09A8\u09CD\u09A7 \u0995\u09B0\u09C1\u09A8'}</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

function BusinessHoursModal({ visible, onClose, insets, isDark, colors }: { visible: boolean; onClose: () => void; insets: any; isDark: boolean; colors: any }) {
  const [availableForCall, setAvailableForCall] = useState(true);
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('9:00 PM');
  const [weekendAvailable, setWeekendAvailable] = useState(false);

  const handleSave = () => {
    Alert.alert('\u09B8\u09AB\u09B2', '\u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u0986\u0993\u09DF\u09BE\u09B0\u09CD\u09B8 \u09B8\u09C7\u09AD \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.modalOverlay} onPress={onClose}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20), backgroundColor: colors.card }]} onStartShouldSetResponder={() => true}>
          <View style={[s.sheetHandle, { backgroundColor: colors.textMuted }]} />
          <Text style={[s.sheetTitle, { color: colors.textPrimary }]}>{'\u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u0986\u0993\u09DF\u09BE\u09B0\u09CD\u09B8'}</Text>

          <View style={[s.bhRow, { borderBottomColor: colors.borderLight }]}>
            <View style={{ flex: 1 }}>
              <Text style={[s.bhLabel, { color: colors.textPrimary }]}>{'\u0995\u09B2\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0989\u09AA\u09B2\u09AC\u09CD\u09A7'}</Text>
              <Text style={[s.bhDesc, { color: colors.textMuted }]}>{'\u09AD\u09BE\u09A1\u09BC\u09BE\u099F\u09BF\u09DF\u09BE\u09B0\u09BE \u0986\u09AA\u09A8\u09BE\u0995\u09C7 \u0995\u09B2 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7'}</Text>
            </View>
            <Switch value={availableForCall} onValueChange={setAvailableForCall} trackColor={{ false: colors.border, true: colors.primaryLight }} thumbColor={availableForCall ? colors.primary : colors.textMuted} />
          </View>

          {availableForCall && (
            <>
              <View style={s.bhTimeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.bhLabel, { color: colors.textPrimary }]}>{'\u09B6\u09C1\u09B0\u09C1'}</Text>
                  <TextInput style={[s.bhTimeInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={startTime} onChangeText={setStartTime} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.bhLabel, { color: colors.textPrimary }]}>{'\u09B6\u09C7\u09B7'}</Text>
                  <TextInput style={[s.bhTimeInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={endTime} onChangeText={setEndTime} />
                </View>
              </View>

              <View style={[s.bhRow, { borderBottomColor: colors.borderLight }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.bhLabel, { color: colors.textPrimary }]}>{'\u09B6\u09C1\u0995\u09CD\u09B0/\u09B6\u09A8\u09BF\u09AC\u09BE\u09B0\u09C7\u0993 \u0989\u09AA\u09B2\u09AC\u09CD\u09A7'}</Text>
                  <Text style={[s.bhDesc, { color: colors.textMuted }]}>{'\u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09BE\u09A8\u09CD\u09A4\u09C7 \u0995\u09B2 \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09C1\u09A8'}</Text>
                </View>
                <Switch value={weekendAvailable} onValueChange={setWeekendAvailable} trackColor={{ false: colors.border, true: colors.primaryLight }} thumbColor={weekendAvailable ? colors.primary : colors.textMuted} />
              </View>
            </>
          )}

          <AnimatedPressable
            onPress={handleSave}
            gradientColors={colors.primaryGradient}
            style={s.sheetBtn}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={s.sheetBtnText}>{'\u09B8\u09C7\u09AD \u0995\u09B0\u09C1\u09A8'}</Text>
          </AnimatedPressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: -8, padding: 16, borderRadius: 16,
    borderWidth: 1, gap: 14,
  },
  avatarLarge: {
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  kycRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  kycText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  statsRow: {
    flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 12,
  },
  statCard: {
    flex: 1, borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1,
  },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },

  menuSection: {
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 16, borderWidth: 1, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    gap: 12, borderBottomWidth: 0.5,
  },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 14,
    borderWidth: 1,
  },
  logoutText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12, maxHeight: '85%',
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18, fontFamily: 'Inter_700Bold',
    textAlign: 'center', marginBottom: 20,
  },
  sheetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: 24, marginTop: 16,
  },
  sheetBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },

  paymentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 12, borderBottomWidth: 0.5,
  },
  paymentIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  paymentLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  paymentInput: {
    borderRadius: 10, paddingHorizontal: 14,
    height: 40, fontSize: 14, fontFamily: 'Inter_400Regular',
    borderWidth: 1,
  },

  earningsCard: {
    borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  earningsLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  earningsValue: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  earningsRow: { flexDirection: 'row', marginBottom: 16 },
  earningsStat: { flex: 1, alignItems: 'center', padding: 12 },
  earningsStatValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  earningsStatLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  earningsList: { gap: 8 },
  earningsListTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  earningsListItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 10, borderWidth: 1,
  },
  earningsListName: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', marginRight: 12 },
  earningsListAmount: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  bhRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  bhLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  bhDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  bhTimeRow: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  bhTimeInput: {
    borderRadius: 10, paddingHorizontal: 14,
    height: 44, fontSize: 14, fontFamily: 'Inter_500Medium',
    borderWidth: 1, marginTop: 6,
  },
});
