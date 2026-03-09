import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/lib/app-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Property } from '@/constants/types';
import { useColors, useTheme } from '@/lib/theme-context';

type FilterType = 'all' | 'pending' | 'verified' | 'featured';

export default function AdminProperties() {
  const insets = useSafeAreaInsets();
  const { properties } = useApp();
  const colors = useColors();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');

  const ADMIN_ACCENT = isDark ? '#A78BFA' : '#6C5CE7';
  const ADMIN_ACCENT_BG = isDark ? '#1E1635' : '#F0EEFF';

  const filteredProperties = properties.filter(p => {
    if (filter === 'pending') return !p.verified;
    if (filter === 'verified') return p.verified;
    if (filter === 'featured') return p.featured;
    return true;
  });

  const toggleVerify = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', id), { verified: !current });
    } catch (e) {
      console.error('Error toggling verify:', e);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', id), { featured: !current });
    } catch (e) {
      console.error('Error toggling featured:', e);
    }
  };

  const toggleAvailable = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', id), { available: !current });
    } catch (e) {
      console.error('Error toggling available:', e);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'প্রপার্টি ডিলিট',
      `আপনি কি "${title}" ডিলিট করতে চান?`,
      [
        { text: 'বাতিল', style: 'cancel' },
        {
          text: 'ডিলিট',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'properties', id));
              Alert.alert('সফল', 'প্রপার্টি সফলভাবে ডিলিট করা হয়েছে।');
            } catch (e) {
              Alert.alert('ত্রুটি', 'প্রপার্টি ডিলিট করতে সমস্যা হয়েছে।');
            }
          },
        },
      ]
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'ফ্ল্যাট',
      house: 'বাড়ি',
      sublet: 'সাবলেট',
      office: 'অফিস',
      shop: 'দোকান',
      mess: 'মেস',
    };
    return labels[type] || type;
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }, !item.available && styles.unavailableCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
            {item.ownerName} • {getTypeLabel(item.type)}
          </Text>
          <Text style={[styles.cardRent, { color: colors.primary }]}>৳{item.rent.toLocaleString()}/মাস</Text>
        </View>
        <View style={styles.cardStats}>
          <View style={styles.viewCount}>
            <Ionicons name="eye-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.viewText, { color: colors.textMuted }]}>{item.views}</Text>
          </View>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: item.verified ? colors.successLight : colors.accentLight }]}>
          <Text style={[styles.badgeText, { color: item.verified ? colors.success : colors.accent }]}>
            {item.verified ? '✓ ভেরিফাইড' : '⏳ পেন্ডিং'}
          </Text>
        </View>
        {item.featured && (
          <View style={[styles.badge, { backgroundColor: isDark ? '#2A2410' : '#FFF8E6' }]}>
            <Text style={[styles.badgeText, { color: isDark ? '#FFD060' : '#FFB800' }]}>★ ফিচার্ড</Text>
          </View>
        )}
        {!item.available && (
          <View style={[styles.badge, { backgroundColor: colors.dangerLight }]}>
            <Text style={[styles.badgeText, { color: colors.danger }]}>অনুপলব্ধ</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.verified ? colors.dangerLight : colors.successLight }]}
          onPress={() => toggleVerify(item.id, item.verified)}
        >
          <Ionicons
            name={item.verified ? 'close-circle' : 'checkmark-circle'}
            size={16}
            color={item.verified ? colors.danger : colors.success}
          />
          <Text style={[styles.actionText, { color: item.verified ? colors.danger : colors.success }]}>
            {item.verified ? 'রিজেক্ট' : 'অ্যাপ্রুভ'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.featured ? colors.accentLight : ADMIN_ACCENT_BG }]}
          onPress={() => toggleFeatured(item.id, item.featured)}
        >
          <Ionicons
            name={item.featured ? 'star-outline' : 'star'}
            size={16}
            color={item.featured ? colors.accent : ADMIN_ACCENT}
          />
          <Text style={[styles.actionText, { color: item.featured ? colors.accent : ADMIN_ACCENT }]}>
            {item.featured ? 'আনফিচার' : 'ফিচার'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.available ? colors.dangerLight : colors.successLight }]}
          onPress={() => toggleAvailable(item.id, item.available)}
        >
          <Ionicons
            name={item.available ? 'eye-off' : 'eye'}
            size={16}
            color={item.available ? colors.danger : colors.success}
          />
        </Pressable>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
          onPress={() => router.push(`/property/${item.id}`)}
        >
          <Ionicons name="open-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>বিস্তারিত</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.dangerLight }]}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={[styles.actionText, { color: colors.danger }]}>ডিলিট</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>প্রপার্টি ম্যানেজমেন্ট</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>মোট {properties.length}টি প্রপার্টি</Text>
      </View>

      <View style={styles.filterRow}>
        {([
          { key: 'all', label: 'সকল' },
          { key: 'pending', label: 'পেন্ডিং' },
          { key: 'verified', label: 'ভেরিফাইড' },
          { key: 'featured', label: 'ফিচার্ড' },
        ] as const).map(f => (
          <Pressable
            key={f.key}
            style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }, filter === f.key && { backgroundColor: ADMIN_ACCENT, borderColor: ADMIN_ACCENT }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, { color: colors.textSecondary }, filter === f.key && { color: '#FFFFFF' }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredProperties}
        renderItem={renderProperty}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        scrollEnabled={filteredProperties.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>কোনো প্রপার্টি পাওয়া যায়নি</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  unavailableCard: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  cardMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  cardRent: { fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 4 },
  cardStats: { alignItems: 'flex-end' },
  viewCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
