import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ActivityIndicator, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { User } from '@/constants/types';
import Colors from '@/constants/colors';

const ADMIN_ACCENT = '#6C5CE7';

export default function AdminUsers() {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'owner'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={Colors.textMuted} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name || 'নাম নেই'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone || '-'}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: item.role === 'owner' ? Colors.secondaryLight : Colors.primaryLight }]}>
          <Text style={[styles.roleText, { color: item.role === 'owner' ? Colors.secondary : Colors.primary }]}>
            {item.role === 'owner' ? 'বাড়িওয়ালা' : 'ভাড়াটিয়া'}
          </Text>
        </View>
      </View>

      <View style={styles.userMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('bn-BD') : '-'}</Text>
        </View>
        <View style={[styles.kycBadge, { backgroundColor: item.kycVerified ? Colors.successLight : Colors.accentLight }]}>
          <Ionicons
            name={item.kycVerified ? 'checkmark-circle' : 'time'}
            size={14}
            color={item.kycVerified ? Colors.success : Colors.accent}
          />
          <Text style={[styles.kycText, { color: item.kycVerified ? Colors.success : Colors.accent }]}>
            {item.kycVerified ? 'KYC ভেরিফাইড' : 'KYC পেন্ডিং'}
          </Text>
        </View>
      </View>

      <View style={styles.userActions}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.kycVerified ? Colors.accentLight : Colors.successLight }]}
          onPress={() => toggleKYC(item.id, !!item.kycVerified)}
        >
          <Ionicons
            name={item.kycVerified ? 'close-circle' : 'checkmark-circle'}
            size={16}
            color={item.kycVerified ? Colors.accent : Colors.success}
          />
          <Text style={[styles.actionBtnText, { color: item.kycVerified ? Colors.accent : Colors.success }]}>
            {item.kycVerified ? 'KYC বাতিল' : 'KYC অ্যাপ্রুভ'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={ADMIN_ACCENT} />
        <Text style={styles.loadingText}>ইউজার লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.title}>ইউজার ম্যানেজমেন্ট</Text>
        <Text style={styles.subtitle}>মোট {users.filter(u => u.role !== 'admin').length} জন ইউজার</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {(['all', 'client', 'owner'] as const).map(role => (
          <Pressable
            key={role}
            style={[styles.filterBtn, filterRole === role && styles.filterBtnActive]}
            onPress={() => setFilterRole(role)}
          >
            <Text style={[styles.filterBtnText, filterRole === role && styles.filterBtnTextActive]}>
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
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>কোনো ইউজার পাওয়া যায়নি</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 12 },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.textPrimary,
    padding: 0,
  },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: ADMIN_ACCENT, borderColor: ADMIN_ACCENT },
  filterBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  filterBtnTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  userEmail: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  userPhone: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  roleText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  userMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
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
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
});
