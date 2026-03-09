import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { chatThreads, user } = useApp();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) {
      return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];
      return days[date.getDay()];
    }
    return date.toLocaleDateString('bn-BD');
  };

  const renderChatItem = ({ item }: { item: typeof chatThreads[0] }) => (
    <Pressable
      style={({ pressed }) => [styles.chatItem, pressed && { backgroundColor: Colors.inputBg }]}
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={22} color={Colors.textMuted} />
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.participantNames[item.participantIds[0] === user?.id ? 1 : 0] || 'ব্যবহারকারী'}
          </Text>
          <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        {item.propertyTitle && (
          <Text style={styles.propertyRef} numberOfLines={1}>{item.propertyTitle}</Text>
        )}
        <Text style={styles.chatMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.headerTitle}>চ্যাট</Text>
      </View>

      <FlatList
        data={chatThreads}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>কোনো চ্যাট নেই</Text>
            <Text style={styles.emptySubtitle}>বাড়িওয়ালাদের সাথে যোগাযোগ শুরু করুন</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 24, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  listContent: { flexGrow: 1 },
  chatItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24,
    paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.inputBg,
    alignItems: 'center', justifyContent: 'center',
  },
  chatContent: { flex: 1, gap: 2 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, flex: 1 },
  chatTime: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  propertyRef: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.primary },
  chatMessage: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  unreadBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  unreadText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
