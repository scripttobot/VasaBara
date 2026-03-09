import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ActivityIndicator, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { User } from '@/constants/types';
import { useColors, useTheme } from '@/lib/theme-context';

export default function AdminUsers() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { isDark } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'owner'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const ADMIN_ACCENT = isDark ? '#A78BFA' : '#6C5CE7';

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const userList: User[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          userList.push({ ...data, id: docSnap.id } as User);
        });
        setUsers(userList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = filterRole === 'all'
      ? users.filter(u => u.role !== 'admin')
      : users.filter(u => u.role === filterRole);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(u =>
        (u.name?.toLowerCase() ?? '').includes(query) ||
        (u.email?.toLowerCase() ?? '').includes(query) ||
        (u.phone?.toLowerCase() ?? '').includes(query)
      );
    }

    return result;
  }, [users, filterRole, searchQuery]);

  const toggleKYC = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { kycVerified: !currentStatus });
      const notifType = !currentStatus ? 'kyc_approved' : 'kyc_declined';
      const notifTitle = !currentStatus ? 'KYC অনুমোদিত হয়েছে' : 'KYC প্রত্যাখ্যাত হয়েছে';
      const notifBody = !currentStatus
        ? 'আপনার KYC ভেরিফিকেশন সফলভাবে অনুমোদিত হয়েছে।'
        : 'আপনার KYC ভেরিফিকেশন প্রত্যাখ্যাত হয়েছে। অনুগ্রহ করে পুনরায় জমা দিন।';
      await addDoc(collection(db, 'notifications'), {
        userId,
        type: notifType,
        title: notifTitle,
        body: notifBody,
        data: {},
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Error updating KYC:', e);
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
      <View style={styles.userHeader}>
        <View style={[styles.avatar, { backgroundColor: colors.inputBg }]}>
          <Ionicons name="person" size={22} color={colors.textMuted} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{item.name || 'নাম নেই'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{item.email}</Text>
          <Text style={[styles.userPhone, { color: colors.textMuted }]}>{item.phone || '-'}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: item.role === 'owner' ? colors.secondaryLight : colors.primaryLight }]}>
          <Text style={[styles.roleText, { color: item.role === 'owner' ? colors.secondary : colors.primary }]}>
            {item.role === 'owner' ? 'বাড়িওয়ালা' : 'ভাড়াটিয়া'}
          </Text>
        </View>
      </View>

      <View style={[styles.userMeta, { borderTopColor: colors.borderLight }]}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('bn-BD') : '-'}</Text>
        </View>
        <View style={[styles.kycBadge, { backgroundColor: item.kycVerified ? colors.successLight : colors.accentLight }]}>
          <Ionicons
            name={item.kycVerified ? 'checkmark-circle' : 'time'}
            size={14}
            color={item.kycVerified ? colors.success : colors.accent}
          />
          <Text style={[styles.kycText, { color: item.kycVerified ? colors.success : colors.accent }]}>
            {item.kycVerified ? 'KYC ভেরিফাইড' : 'KYC পেন্ডিং'}
          </Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.kycVerified ? colors.accentLight : colors.successLight }]}
          onPress={() => toggleKYC(item.id, !!item.kycVerified)}
        >
          <Ionicons
            name={item.kycVerified ? 'close-circle' : 'checkmark-circle'}
            size={16}
            color={item.kycVerified ? colors.accent : colors.success}
          />
          <Text style={[styles.actionBtnText, { color: item.kycVerified ? colors.accent : colors.success }]}>
            {item.kycVerified ? 'KYC বাতিল' : 'KYC অ্যাপ্রুভ'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={ADMIN_ACCENT} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>ইউজার লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>ইউজার ম্যানেজমেন্ট</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>মোট {users.filter(u => u.role !== 'admin').length} জন ইউজার</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {(['all', 'client', 'owner'] as const).map(role => (
          <Pressable
            key={role}
            style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }, filterRole === role && { backgroundColor: ADMIN_ACCENT, borderColor: ADMIN_ACCENT }]}
            onPress={() => setFilterRole(role)}
          >
            <Text style={[styles.filterBtnText, { color: colors.textSecondary }, filterRole === role && { color: '#FFFFFF' }]}>
              {role === 'all' ? 'সকল' : role === 'client' ? 'ভাড়াটিয়া' : 'বাড়িওয়ালা'}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        scrollEnabled={filteredUsers.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>কোনো ইউজার পাওয়া যায়নি</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 12 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  userCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  userEmail: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  userPhone: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  roleText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  userMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  kycBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  kycText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  userActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
