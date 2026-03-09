import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { Property } from '@/constants/types';
import Colors from '@/constants/colors';

const ADMIN_ACCENT = '#6C5CE7';

type FilterType = 'all' | 'pending' | 'verified' | 'featured';

export default function AdminProperties() {
  const insets = useSafeAreaInsets();
  const { properties } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [localProperties, setLocalProperties] = useState(properties);

  const filteredProperties = localProperties.filter(p => {
    if (filter === 'pending') return !p.verified;
    if (filter === 'verified') return p.verified;
    if (filter === 'featured') return p.featured;
    return true;
  });

  const toggleVerify = (id: string) => {
    setLocalProperties(prev => prev.map(p =>
      p.id === id ? { ...p, verified: !p.verified } : p
    ));
  };

  const toggleFeatured = (id: string) => {
    setLocalProperties(prev => prev.map(p =>
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  const toggleAvailable = (id: string) => {
    setLocalProperties(prev => prev.map(p =>
      p.id === id ? { ...p, available: !p.available } : p
    ));
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
    <View style={[styles.card, !item.available && styles.unavailableCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardMeta}>
            {item.ownerName} • {getTypeLabel(item.type)}
          </Text>
          <Text style={styles.cardRent}>৳{item.rent.toLocaleString()}/মাস</Text>
        </View>
        <View style={styles.cardStats}>
          <View style={styles.viewCount}>
            <Ionicons name="eye-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.viewText}>{item.views}</Text>
          </View>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: item.verified ? Colors.successLight : Colors.accentLight }]}>
          <Text style={[styles.badgeText, { color: item.verified ? Colors.success : Colors.accent }]}>
            {item.verified ? '✓ ভেরিফাইড' : '⏳ পেন্ডিং'}
          </Text>
        </View>
        {item.featured && (
          <View style={[styles.badge, { backgroundColor: '#FFF8E6' }]}>
            <Text style={[styles.badgeText, { color: '#FFB800' }]}>★ ফিচার্ড</Text>
          </View>
        )}
        {!item.available && (
          <View style={[styles.badge, { backgroundColor: Colors.dangerLight }]}>
            <Text style={[styles.badgeText, { color: Colors.danger }]}>অনুপলব্ধ</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.verified ? Colors.dangerLight : Colors.successLight }]}
          onPress={() => toggleVerify(item.id)}
        >
          <Ionicons
            name={item.verified ? 'close-circle' : 'checkmark-circle'}
            size={16}
            color={item.verified ? Colors.danger : Colors.success}
          />
          <Text style={[styles.actionText, { color: item.verified ? Colors.danger : Colors.success }]}>
            {item.verified ? 'রিজেক্ট' : 'অ্যাপ্রুভ'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.featured ? Colors.accentLight : '#F0EEFF' }]}
          onPress={() => toggleFeatured(item.id)}
        >
          <Ionicons
            name={item.featured ? 'star-outline' : 'star'}
            size={16}
            color={item.featured ? Colors.accent : ADMIN_ACCENT}
          />
          <Text style={[styles.actionText, { color: item.featured ? Colors.accent : ADMIN_ACCENT }]}>
            {item.featured ? 'আনফিচার' : 'ফিচার'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, { backgroundColor: item.available ? Colors.dangerLight : Colors.successLight }]}
          onPress={() => toggleAvailable(item.id)}
        >
          <Ionicons
            name={item.available ? 'eye-off' : 'eye'}
            size={16}
            color={item.available ? Colors.danger : Colors.success}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.title}>প্রপার্টি ম্যানেজমেন্ট</Text>
        <Text style={styles.subtitle}>মোট {localProperties.length}টি প্রপার্টি</Text>
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
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
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
            <Ionicons name="business-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>কোনো প্রপার্টি পাওয়া যায়নি</Text>
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: ADMIN_ACCENT, borderColor: ADMIN_ACCENT },
  filterText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  filterTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  unavailableCard: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  cardMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  cardRent: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.primary, marginTop: 4 },
  cardStats: { alignItems: 'flex-end' },
  viewCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
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
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
});
