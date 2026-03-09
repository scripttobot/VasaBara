import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/lib/app-context';
import { useColors, useTheme } from '@/lib/theme-context';

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { properties } = useApp();
  const colors = useColors();
  const { isDark } = useTheme();

  const ADMIN_ACCENT = isDark ? '#A78BFA' : '#6C5CE7';
  const ADMIN_ACCENT_BG = isDark ? '#1E1635' : '#F0EEFF';

  const totalProperties = properties.length;
  const verifiedProperties = properties.filter(p => p.verified).length;
  const pendingProperties = properties.filter(p => !p.verified).length;
  const featuredProperties = properties.filter(p => p.featured).length;
  const availableProperties = properties.filter(p => p.available).length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);

  const stats = [
    { label: 'মোট প্রপার্টি', value: totalProperties, icon: 'business' as const, color: ADMIN_ACCENT, bg: ADMIN_ACCENT_BG },
    { label: 'ভেরিফাইড', value: verifiedProperties, icon: 'checkmark-circle' as const, color: colors.success, bg: colors.successLight },
    { label: 'পেন্ডিং', value: pendingProperties, icon: 'time' as const, color: colors.accent, bg: colors.accentLight },
    { label: 'ফিচার্ড', value: featuredProperties, icon: 'star' as const, color: colors.secondary, bg: colors.secondaryLight },
    { label: 'এভেইলেবল', value: availableProperties, icon: 'home' as const, color: colors.primary, bg: colors.primaryLight },
    { label: 'মোট ভিউ', value: totalViews, icon: 'eye' as const, color: isDark ? '#F472B6' : '#E84393', bg: isDark ? '#2A1425' : '#FFF0F6' },
  ];

  const recentProperties = properties.slice(0, 5);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>অ্যাডমিন প্যানেল</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>বাসভাড়া ম্যানেজমেন্ট</Text>
          </View>
          <View style={[styles.adminBadge, { backgroundColor: ADMIN_ACCENT }]}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
            <View style={[styles.statIconContainer, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>সাম্প্রতিক প্রপার্টি</Text>
        {recentProperties.map(property => (
          <View key={property.id} style={[styles.propertyItem, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
            <View style={styles.propertyInfo}>
              <Text style={[styles.propertyTitle, { color: colors.textPrimary }]} numberOfLines={1}>{property.title}</Text>
              <Text style={[styles.propertyMeta, { color: colors.textSecondary }]}>
                {property.ownerName} • ৳{property.rent.toLocaleString()}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: property.verified ? colors.successLight : colors.accentLight }
            ]}>
              <Text style={[
                styles.statusText,
                { color: property.verified ? colors.success : colors.accent }
              ]}>
                {property.verified ? 'ভেরিফাইড' : 'পেন্ডিং'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>দ্রুত কাজ</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]} onPress={() => router.navigate('/(admin)/properties')}>
            <Ionicons name="checkmark-done-circle" size={28} color={colors.success} />
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>প্রপার্টি অ্যাপ্রুভ</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]} onPress={() => router.navigate('/(admin)/users')}>
            <Ionicons name="people-circle" size={28} color={ADMIN_ACCENT} />
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>ইউজার ম্যানেজ</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]} onPress={() => Alert.alert('রিপোর্টেড', 'কোনো রিপোর্ট নেই')}>
            <Ionicons name="flag" size={28} color={colors.danger} />
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>রিপোর্টেড</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.borderLight }]} onPress={() => Alert.alert('অ্যানালিটিক্স', `মোট প্রপার্টি: ${totalProperties}\nভেরিফাইড: ${verifiedProperties}\nপেন্ডিং: ${pendingProperties}\nফিচার্ড: ${featuredProperties}\nএভেইলেবল: ${availableProperties}\nমোট ভিউ: ${totalViews}`)}>
            <Ionicons name="analytics" size={28} color={colors.secondary} />
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>অ্যানালিটিক্স</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 2 },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  adminBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  statCard: {
    width: '47%' as any,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', marginBottom: 14 },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  propertyInfo: { flex: 1, marginRight: 10 },
  propertyTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  propertyMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%' as any,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  actionLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center' as const },
});
