import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';

const ADMIN_ACCENT = '#6C5CE7';

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { properties } = useApp();

  const totalProperties = properties.length;
  const verifiedProperties = properties.filter(p => p.verified).length;
  const pendingProperties = properties.filter(p => !p.verified).length;
  const featuredProperties = properties.filter(p => p.featured).length;
  const availableProperties = properties.filter(p => p.available).length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);

  const stats = [
    { label: 'মোট প্রপার্টি', value: totalProperties, icon: 'business' as const, color: ADMIN_ACCENT, bg: '#F0EEFF' },
    { label: 'ভেরিফাইড', value: verifiedProperties, icon: 'checkmark-circle' as const, color: Colors.success, bg: Colors.successLight },
    { label: 'পেন্ডিং', value: pendingProperties, icon: 'time' as const, color: Colors.accent, bg: Colors.accentLight },
    { label: 'ফিচার্ড', value: featuredProperties, icon: 'star' as const, color: Colors.secondary, bg: Colors.secondaryLight },
    { label: 'এভেইলেবল', value: availableProperties, icon: 'home' as const, color: Colors.primary, bg: Colors.primaryLight },
    { label: 'মোট ভিউ', value: totalViews, icon: 'eye' as const, color: '#E84393', bg: '#FFF0F6' },
  ];

  const recentProperties = properties.slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>অ্যাডমিন প্যানেল</Text>
            <Text style={styles.subtitle}>বাসভাড়া ম্যানেজমেন্ট</Text>
          </View>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>সাম্প্রতিক প্রপার্টি</Text>
        {recentProperties.map(property => (
          <View key={property.id} style={styles.propertyItem}>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle} numberOfLines={1}>{property.title}</Text>
              <Text style={styles.propertyMeta}>
                {property.ownerName} • ৳{property.rent.toLocaleString()}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: property.verified ? Colors.successLight : Colors.accentLight }
            ]}>
              <Text style={[
                styles.statusText,
                { color: property.verified ? Colors.success : Colors.accent }
              ]}>
                {property.verified ? 'ভেরিফাইড' : 'পেন্ডিং'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>দ্রুত কাজ</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionCard} onPress={() => router.navigate('/(admin)/properties')}>
            <Ionicons name="checkmark-done-circle" size={28} color={Colors.success} />
            <Text style={styles.actionLabel}>প্রপার্টি অ্যাপ্রুভ</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => router.navigate('/(admin)/users')}>
            <Ionicons name="people-circle" size={28} color={ADMIN_ACCENT} />
            <Text style={styles.actionLabel}>ইউজার ম্যানেজ</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => Alert.alert('রিপোর্টেড', 'কোনো রিপোর্ট নেই')}>
            <Ionicons name="flag" size={28} color={Colors.danger} />
            <Text style={styles.actionLabel}>রিপোর্টেড</Text>
          </Pressable>
          <Pressable style={styles.actionCard} onPress={() => Alert.alert('অ্যানালিটিক্স', `মোট প্রপার্টি: ${totalProperties}\nভেরিফাইড: ${verifiedProperties}\nপেন্ডিং: ${pendingProperties}\nফিচার্ড: ${featuredProperties}\nএভেইলেবল: ${availableProperties}\nমোট ভিউ: ${totalViews}`)}>
            <Ionicons name="analytics" size={28} color={Colors.secondary} />
            <Text style={styles.actionLabel}>অ্যানালিটিক্স</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ADMIN_ACCENT,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  statLabel: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, marginBottom: 14 },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  propertyInfo: { flex: 1, marginRight: 10 },
  propertyTitle: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  propertyMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%' as any,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textPrimary, textAlign: 'center' },
});
