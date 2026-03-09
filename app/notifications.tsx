import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { ThemeColors } from '@/constants/colors';
import { AppNotification } from '@/constants/types';

function getNotificationIcon(type: AppNotification['type'], colors: ThemeColors): { name: keyof typeof Ionicons.glyphMap; color: string; bg: string } {
  switch (type) {
    case 'message':
      return { name: 'chatbubble', color: colors.primary, bg: colors.primaryLight };
    case 'new_property':
      return { name: 'business', color: colors.secondary, bg: colors.secondaryLight };
    case 'kyc_approved':
      return { name: 'checkmark-circle', color: colors.success, bg: colors.successLight };
    case 'kyc_declined':
      return { name: 'close-circle', color: colors.danger, bg: colors.dangerLight };
    case 'system':
      return { name: 'information-circle', color: '#8B5CF6', bg: '#F3E8FF' };
    default:
      return { name: 'notifications', color: colors.textSecondary, bg: colors.inputBg };
  }
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'এইমাত্র';
  if (diffMin < 60) return `${diffMin} মিনিট আগে`;
  if (diffHr < 24) return `${diffHr} ঘন্টা আগে`;
  if (diffDay < 7) return `${diffDay} দিন আগে`;
  return date.toLocaleDateString('bn-BD');
}

function NotificationItem({ item, onPress, colors }: { item: AppNotification; onPress: () => void; colors: ThemeColors }) {
  const icon = getNotificationIcon(item.type, colors);

  return (
    <Pressable
      style={({ pressed }) => [
        { flexDirection: 'row' as const, alignItems: 'flex-start' as const, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: 14 },
        !item.read && { backgroundColor: colors.primaryLight },
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.notifIconWrap, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, { color: colors.textPrimary }, !item.read && styles.notifTitleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.notifBody, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={[styles.notifTime, { color: colors.textMuted }]}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useApp();
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const load = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const val = await AsyncStorage.getItem('@bashvara_notification_prefs');
        if (val) setPrefs(JSON.parse(val));
      } catch {}
    };
    load();
  }, []);

  const typeMap: Record<string, string> = { message: 'messages', new_property: 'newProperty', kyc_approved: 'kycStatus', kyc_declined: 'kycStatus', system: 'system' };
  const filteredNotifications = notifications.filter(n => {
    const key = typeMap[n.type];
    return key ? prefs[key] !== false : true;
  });

  const handleNotificationPress = (notif: AppNotification) => {
    if (!notif.read) {
      markNotificationRead(notif.id);
    }

    switch (notif.type) {
      case 'message':
        if (notif.data?.chatId) {
          router.push({ pathname: '/chat/[id]', params: { id: notif.data.chatId } });
        }
        break;
      case 'new_property':
        if (notif.data?.propertyId) {
          router.push({ pathname: '/property/[id]', params: { id: notif.data.propertyId } });
        }
        break;
      case 'kyc_approved':
      case 'kyc_declined':
        router.push('/edit-profile');
        break;
      default:
        break;
    }
  };

  return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 67 + insets.top : insets.top }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>নোটিফিকেশন</Text>
          {unreadNotificationCount > 0 ? (
            <Pressable onPress={markAllNotificationsRead} style={styles.markAllBtn}>
              <Ionicons name="checkmark-done" size={22} color={colors.primary} />
            </Pressable>
          ) : <View style={{ width: 40 }} />}
        </View>
        {unreadNotificationCount > 0 && (
          <Pressable style={[styles.markAllBar, { backgroundColor: colors.primaryLight, borderBottomColor: colors.border }]} onPress={markAllNotificationsRead}>
            <Ionicons name="checkmark-done-outline" size={18} color={colors.primary} />
            <Text style={[styles.markAllText, { color: colors.primary }]}>সব পড়া হয়েছে</Text>
          </Pressable>
        )}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => handleNotificationPress(item)} colors={colors} />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 && styles.emptyContainer,
            { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 20) },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconWrap, { backgroundColor: colors.inputBg }]}>
                <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>কোনো নোটিফিকেশন নেই</Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>নতুন নোটিফিকেশন এলে এখানে দেখাবে</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  listContent: { paddingTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  markAllBtn: { marginRight: 8, padding: 6 },
  markAllBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  markAllText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifContent: { flex: 1, gap: 3 },
  notifTitle: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  notifTitleUnread: { fontFamily: 'Inter_600SemiBold' },
  notifBody: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  emptyState: { alignItems: 'center', gap: 8, paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  emptySubtext: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
