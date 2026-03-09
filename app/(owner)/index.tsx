import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { useTheme } from '@/lib/theme-context';
import AnimatedPressable from '@/components/AnimatedPressable';

export default function OwnerDashboard() {
  const insets = useSafeAreaInsets();
  const { user, properties, chatThreads, unreadNotificationCount } = useApp();
  const { isDark, colors } = useTheme();
  const ownerProperties = properties.filter(p => p.ownerId === user?.id);
  const totalViews = ownerProperties.reduce((sum, p) => sum + p.views, 0);
  const ownerChats = chatThreads.length;

  const stats = [
    { icon: 'business-outline' as const, label: '\u09AE\u09CB\u099F \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF', value: ownerProperties.length.toString(), gradient: colors.primaryGradient },
    { icon: 'eye-outline' as const, label: '\u09AE\u09CB\u099F \u09AD\u09BF\u0989', value: totalViews.toString(), gradient: colors.secondaryGradient },
    { icon: 'chatbubbles-outline' as const, label: '\u09AE\u09C7\u09B8\u09C7\u099C', value: ownerChats.toString(), gradient: ['#8B5CF6', '#A78BFA'] as [string, string] },
    { icon: 'checkmark-circle-outline' as const, label: '\u09B8\u0995\u09CD\u09B0\u09BF\u09DF', value: ownerProperties.filter(p => p.available).length.toString(), gradient: ['#38A169', '#4ADE80'] as [string, string] },
  ];

  const handleQuickAction = (label: string) => {
    switch (label) {
      case '\u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF \u09AF\u09CB\u0997':
        router.push('/(owner)/add-property');
        break;
      case '\u0986\u09AE\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF':
        router.push('/(owner)/my-properties');
        break;
      case '\u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F':
        Alert.alert('\u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F', `\u09AE\u09CB\u099F \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF: ${ownerProperties.length}\n\u09B8\u0995\u09CD\u09B0\u09BF\u09DF: ${ownerProperties.filter(p => p.available).length}\n\u09AE\u09CB\u099F \u09AD\u09BF\u0989: ${totalViews}`);
        break;
      case '\u09B8\u09C7\u099F\u09BF\u0982\u09B8':
        router.push('/(owner)/owner-profile');
        break;
    }
  };

  const quickActions = [
    { icon: 'add-circle-outline' as const, label: '\u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF \u09AF\u09CB\u0997', color: colors.primary },
    { icon: 'business-outline' as const, label: '\u0986\u09AE\u09BE\u09B0 \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF', color: colors.secondary },
    { icon: 'bar-chart-outline' as const, label: '\u09B0\u09BF\u09AA\u09CB\u09B0\u09CD\u099F', color: '#8B5CF6' },
    { icon: 'settings-outline' as const, label: '\u09B8\u09C7\u099F\u09BF\u0982\u09B8', color: colors.textSecondary },
  ];

  const recentProperties = ownerProperties
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={colors.headerGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}
        >
          <View>
            <Text style={styles.greeting}>{'\u09AC\u09BE\u09A1\u09BC\u09BF\u0993\u09DF\u09BE\u09B2\u09BE \u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1'}</Text>
            <Text style={styles.headerTitle}>{user?.name || '\u09B8\u09CD\u09AC\u09BE\u0997\u09A4\u09AE'}</Text>
          </View>
          <Pressable style={[styles.notifBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            {unreadNotificationCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</Text>
              </View>
            )}
          </Pressable>
        </LinearGradient>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <AnimatedPressable key={i} style={styles.statCard} scaleValue={0.97}>
              <LinearGradient
                colors={stat.gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Ionicons name={stat.icon} size={22} color="rgba(255,255,255,0.9)" />
              </LinearGradient>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </AnimatedPressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{'\u09A6\u09CD\u09B0\u09C1\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09CD\u09B0\u09AE'}</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, i) => (
              <AnimatedPressable key={i} style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => handleQuickAction(action.label)} scaleValue={0.95}>
                <Ionicons name={action.icon} size={26} color={action.color} />
                <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>{action.label}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{'\u09B8\u09BE\u09AE\u09CD\u09AA\u09CD\u09B0\u09A4\u09BF\u0995 \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF'}</Text>
          </View>
          {recentProperties.length > 0 ? (
            <View style={[styles.recentList, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recentProperties.map(p => (
                <Pressable
                  key={p.id}
                  style={({ pressed }) => [styles.recentItem, { borderBottomColor: colors.borderLight }, pressed && { backgroundColor: colors.inputBg }]}
                  onPress={() => router.push({ pathname: '/property/[id]', params: { id: p.id } })}
                >
                  <View style={[styles.recentDot, { backgroundColor: p.available ? colors.success : colors.danger }]} />
                  <View style={styles.recentInfo}>
                    <Text style={[styles.recentTitle, { color: colors.textPrimary }]} numberOfLines={1}>{p.title}</Text>
                    <Text style={[styles.recentDate, { color: colors.textMuted }]}>{new Date(p.createdAt).toLocaleDateString('bn-BD')}</Text>
                  </View>
                  <Text style={[styles.recentRent, { color: colors.secondary }]}>{'\u09F3'}{p.rent.toLocaleString()}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={[styles.activityEmpty, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={36} color={colors.textMuted} />
              <Text style={[styles.activityEmptyText, { color: colors.textPrimary }]}>{'\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF \u09A8\u09C7\u0987'}</Text>
              <Text style={[styles.activityEmptySubtext, { color: colors.textSecondary }]}>{'\u09AA\u09CD\u09B0\u09AA\u09BE\u09B0\u09CD\u099F\u09BF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09A4\u09C7'}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24, paddingBottom: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  notifBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#E53E3E', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notifBadgeText: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginTop: 16, gap: 12 },
  statCard: {
    width: '47%' as any, borderRadius: 16, padding: 16, gap: 6,
  },
  statGradient: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  quickGrid: { flexDirection: 'row', gap: 12 },
  quickCard: {
    flex: 1, alignItems: 'center', gap: 8, paddingVertical: 16,
    borderRadius: 14, borderWidth: 1,
  },
  quickLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  recentList: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, gap: 12,
  },
  recentDot: { width: 10, height: 10, borderRadius: 5 },
  recentInfo: { flex: 1, gap: 2 },
  recentTitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  recentDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  recentRent: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  activityEmpty: { alignItems: 'center', paddingVertical: 30, gap: 6, borderRadius: 16, borderWidth: 1 },
  activityEmptyText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  activityEmptySubtext: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
