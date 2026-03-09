import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { AppNotification } from '@/constants/types';

function getNotificationIcon(type: AppNotification['type']): { name: keyof typeof Ionicons.glyphMap; color: string; bg: string } {
  switch (type) {
    case 'message':
      return { name: 'chatbubble', color: Colors.primary, bg: Colors.primaryLight };
    case 'new_property':
      return { name: 'business', color: Colors.secondary, bg: Colors.secondaryLight };
    case 'kyc_approved':
      return { name: 'checkmark-circle', color: Colors.success, bg: Colors.successLight };
    case 'kyc_declined':
      return { name: 'close-circle', color: Colors.danger, bg: Colors.dangerLight };
    case 'system':
      return { name: 'information-circle', color: '#8B5CF6', bg: '#F3E8FF' };
    default:
      return { name: 'notifications', color: Colors.textSecondary, bg: Colors.inputBg };
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

function NotificationItem({ item, onPress }: { item: AppNotification; onPress: () => void }) {
  const icon = getNotificationIcon(item.type);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.notifItem,
        !item.read && styles.notifItemUnread,
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.notifIconWrap, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.notifBody} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.notifTime}>{formatTimeAgo(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
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
      <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 + insets.top : insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>নোটিফিকেশন</Text>
          {unreadNotificationCount > 0 ? (
            <Pressable onPress={markAllNotificationsRead} style={styles.markAllBtn}>
              <Ionicons name="checkmark-done" size={22} color={Colors.primary} />
            </Pressable>
          ) : <View style={{ width: 40 }} />}
        </View>
        {unreadNotificationCount > 0 && (
          <Pressable style={styles.markAllBar} onPress={markAllNotificationsRead}>
            <Ionicons name="checkmark-done-outline" size={18} color={Colors.primary} />
            <Text style={styles.markAllText}>সব পড়া হয়েছে</Text>
          </Pressable>
        )}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem item={item} onPress={() => handleNotificationPress(item)} />
          )}
          contentContainerStyle={[
            styles.listContent,
            filteredNotifications.length === 0 && styles.emptyContainer,
            { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 20) },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>কোনো নোটিফিকেশন নেই</Text>
              <Text style={styles.emptySubtext}>নতুন নোটিফিকেশন এলে এখানে দেখাবে</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  listContent: { paddingTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center' },
  markAllBtn: { marginRight: 8, padding: 6 },
  markAllBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  markAllText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.primary },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 14,
  },
  notifItemUnread: { backgroundColor: '#F0FAF8' },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifContent: { flex: 1, gap: 3 },
  notifTitle: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  notifTitleUnread: { fontFamily: 'Inter_600SemiBold' },
  notifBody: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18 },
  notifTime: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  emptyState: { alignItems: 'center', gap: 8, paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  emptySubtext: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center' },
});
