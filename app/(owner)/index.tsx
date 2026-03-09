import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';

export default function OwnerDashboard() {
  const insets = useSafeAreaInsets();
  const { user, properties, chatThreads, unreadNotificationCount } = useApp();
  const ownerProperties = properties.filter(p => p.ownerId === user?.id);
  const totalViews = ownerProperties.reduce((sum, p) => sum + p.views, 0);
  const ownerChats = chatThreads.length;

  const stats = [
    { icon: 'business-outline' as const, label: 'মোট প্রপার্টি', value: ownerProperties.length.toString(), color: Colors.primary, bg: Colors.primaryLight },
    { icon: 'eye-outline' as const, label: 'মোট ভিউ', value: totalViews.toString(), color: Colors.secondary, bg: Colors.secondaryLight },
    { icon: 'chatbubbles-outline' as const, label: 'মেসেজ', value: ownerChats.toString(), color: '#8B5CF6', bg: '#F3E8FF' },
    { icon: 'checkmark-circle-outline' as const, label: 'সক্রিয়', value: ownerProperties.filter(p => p.available).length.toString(), color: Colors.success, bg: Colors.successLight },
  ];

  const handleQuickAction = (label: string) => {
    switch (label) {
      case 'প্রপার্টি যোগ':
        router.push('/(owner)/add-property');
        break;
      case 'আমার প্রপার্টি':
        router.push('/(owner)/my-properties');
        break;
      case 'রিপোর্ট':
        Alert.alert('রিপোর্ট', `মোট প্রপার্টি: ${ownerProperties.length}\nসক্রিয়: ${ownerProperties.filter(p => p.available).length}\nমোট ভিউ: ${totalViews}`);
        break;
      case 'সেটিংস':
        router.push('/(owner)/owner-profile');
        break;
    }
  };

  const quickActions = [
    { icon: 'add-circle-outline' as const, label: 'প্রপার্টি যোগ', color: Colors.primary },
    { icon: 'business-outline' as const, label: 'আমার প্রপার্টি', color: Colors.secondary },
    { icon: 'bar-chart-outline' as const, label: 'রিপোর্ট', color: '#8B5CF6' },
    { icon: 'settings-outline' as const, label: 'সেটিংস', color: Colors.textSecondary },
  ];

  const recentProperties = ownerProperties
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <View>
            <Text style={styles.greeting}>বাড়িওয়ালা ড্যাশবোর্ড</Text>
            <Text style={styles.headerTitle}>{user?.name || 'স্বাগতম'}</Text>
          </View>
          <Pressable style={styles.notifBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            {unreadNotificationCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>দ্রুত কার্যক্রম</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.8 }]} onPress={() => handleQuickAction(action.label)}>
                <Ionicons name={action.icon} size={26} color={action.color} />
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>সাম্প্রতিক প্রপার্টি</Text>
          </View>
          {recentProperties.length > 0 ? (
            <View style={styles.recentList}>
              {recentProperties.map(p => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [styles.recentItem, pressed && { backgroundColor: Colors.inputBg }]}
                  onPress={() => router.push({ pathname: '/property/[id]', params: { id: p.id } })}
                >
                  <View style={[styles.recentDot, { backgroundColor: p.available ? Colors.success : Colors.danger }]} />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.recentDate}>{new Date(p.createdAt).toLocaleDateString('bn-BD')}</Text>
                  </View>
                  <Text style={styles.recentRent}>{'\u09F3'}{p.rent.toLocaleString()}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.activityEmpty}>
              <Ionicons name="time-outline" size={36} color={Colors.textMuted} />
              <Text style={styles.activityEmptyText}>এখনো কোনো প্রপার্টি নেই</Text>
              <Text style={styles.activityEmptySubtext}>প্রপার্টি যোগ করুন শুরু করতে</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 24, paddingBottom: 20, backgroundColor: '#FFFFFF',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  notifBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notifBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, marginTop: 16, gap: 12 },
  statCard: {
    width: '47%' as any, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  statLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, marginBottom: 12 },
  quickGrid: { flexDirection: 'row', gap: 12 },
  quickCard: {
    flex: 1, alignItems: 'center', gap: 8, paddingVertical: 16,
    backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
  },
  quickLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, textAlign: 'center' },
  recentList: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight, gap: 12,
  },
  recentDot: { width: 10, height: 10, borderRadius: 5 },
  recentInfo: { flex: 1, gap: 2 },
  recentTitle: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  recentDate: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  recentRent: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.secondary },
  activityEmpty: { alignItems: 'center', paddingVertical: 30, gap: 6, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  activityEmptyText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  activityEmptySubtext: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
