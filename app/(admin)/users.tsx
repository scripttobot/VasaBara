import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const ADMIN_ACCENT = '#6C5CE7';

interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'owner';
  kycVerified: boolean;
  blocked: boolean;
  createdAt: string;
}

const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'আব্দুল করিম', email: 'karim@example.com', phone: '01712345678', role: 'owner', kycVerified: true, blocked: false, createdAt: '2025-01-15' },
  { id: '2', name: 'ফাতেমা বেগম', email: 'fatema@example.com', phone: '01812345678', role: 'owner', kycVerified: true, blocked: false, createdAt: '2025-01-20' },
  { id: '3', name: 'রহিম উদ্দিন', email: 'rahim@example.com', phone: '01912345678', role: 'owner', kycVerified: false, blocked: false, createdAt: '2025-02-01' },
  { id: '4', name: 'সাকিব আলম', email: 'sakib@example.com', phone: '01612345678', role: 'client', kycVerified: false, blocked: false, createdAt: '2025-02-05' },
  { id: '5', name: 'নুসরাত জাহান', email: 'nusrat@example.com', phone: '01512345678', role: 'client', kycVerified: true, blocked: false, createdAt: '2025-02-08' },
  { id: '6', name: 'মোহাম্মদ হাসান', email: 'hasan@example.com', phone: '01412345678', role: 'owner', kycVerified: false, blocked: true, createdAt: '2025-02-10' },
];

export default function AdminUsers() {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'owner'>('all');

  const filteredUsers = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  const toggleBlock = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, blocked: !u.blocked } : u
    ));
  };

  const toggleKYC = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, kycVerified: !u.kycVerified } : u
    ));
  };

  const renderUser = ({ item }: { item: MockUser }) => (
    <View style={[styles.userCard, item.blocked && styles.blockedCard]}>
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={Colors.textMuted} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone}</Text>
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
          <Text style={styles.metaText}>{item.createdAt}</Text>
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
          onPress={() => toggleKYC(item.id)}
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

        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.blocked ? Colors.successLight : Colors.dangerLight }]}
          onPress={() => toggleBlock(item.id)}
        >
          <Ionicons
            name={item.blocked ? 'checkmark' : 'ban'}
            size={16}
            color={item.blocked ? Colors.success : Colors.danger}
          />
          <Text style={[styles.actionBtnText, { color: item.blocked ? Colors.success : Colors.danger }]}>
            {item.blocked ? 'আনব্লক' : 'ব্লক'}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.title}>ইউজার ম্যানেজমেন্ট</Text>
        <Text style={styles.subtitle}>মোট {users.length} জন ইউজার</Text>
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
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
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
  blockedCard: { borderColor: Colors.danger, opacity: 0.7 },
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
