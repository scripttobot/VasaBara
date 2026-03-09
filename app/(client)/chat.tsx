import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, TextInput, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { chatThreads, user, deleteAllChatsPermananently } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return chatThreads;
    const q = searchQuery.toLowerCase();
    return chatThreads.filter(t => {
      const otherName = t.participantNames[t.participantIds[0] === user?.id ? 1 : 0] || '';
      return otherName.toLowerCase().includes(q) ||
        (t.propertyTitle || '').toLowerCase().includes(q) ||
        (t.lastMessage || '').toLowerCase().includes(q);
    });
  }, [chatThreads, searchQuery, user]);

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

  const handleDeleteAllChats = () => {
    setShowSettings(false);
    Alert.alert(
      'সব চ্যাট মুছুন',
      'আপনি কি সব চ্যাট স্থায়ীভাবে মুছে ফেলতে চান? এটি Firebase থেকে সম্পূর্ণরূপে মুছে যাবে এবং পুনরুদ্ধার করা যাবে না।',
      [
        { text: 'না', style: 'cancel' },
        {
          text: 'হ্যাঁ, সব মুছুন',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            await deleteAllChatsPermananently();
            setDeleting(false);
          },
        },
      ]
    );
  };

  const renderChatItem = ({ item }: { item: typeof chatThreads[0] }) => {
    const otherName = item.participantNames[item.participantIds[0] === user?.id ? 1 : 0] || 'ব্যবহারকারী';
    const initials = otherName.charAt(0).toUpperCase();

    return (
      <Pressable
        style={({ pressed }) => [s.chatItem, pressed && { backgroundColor: '#F5F6F8' }]}
        onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
      >
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View style={s.chatContent}>
          <View style={s.chatTop}>
            <Text style={s.chatName} numberOfLines={1}>{otherName}</Text>
            <Text style={s.chatTime}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          {item.propertyTitle && (
            <Text style={s.propertyRef} numberOfLines={1}>{item.propertyTitle}</Text>
          )}
          <Text style={s.chatMessage} numberOfLines={1}>{item.lastMessage || 'কোনো মেসেজ নেই'}</Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={s.unreadBadge}>
            <Text style={s.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 4 }} />
      </Pressable>
    );
  };

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>চ্যাট</Text>
          <Pressable onPress={() => setShowSettings(true)} style={s.settingsBtn} hitSlop={8}>
            <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={s.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="চ্যাট খুঁজুন..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredThreads}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={s.emptyTitle}>
              {searchQuery.trim() ? 'কোনো ফলাফল পাওয়া যায়নি' : 'কোনো চ্যাট নেই'}
            </Text>
            <Text style={s.emptySubtitle}>
              {searchQuery.trim() ? 'অন্য কিছু দিয়ে খুঁজুন' : 'বাড়িওয়ালাদের সাথে যোগাযোগ শুরু করুন'}
            </Text>
          </View>
        }
      />

      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setShowSettings(false)}>
          <View style={[s.settingsSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={s.sheetHandle} />
            <Text style={s.settingsTitle}>চ্যাট সেটিংস</Text>

            <Pressable style={s.settingsItem} onPress={handleDeleteAllChats} disabled={deleting || chatThreads.length === 0}>
              <View style={[s.settingsIcon, { backgroundColor: '#FFF0F0' }]}>
                <Ionicons name="trash-outline" size={22} color={Colors.danger} />
              </View>
              <View style={s.settingsItemContent}>
                <Text style={[s.settingsLabel, { color: Colors.danger }]}>সব চ্যাট মুছুন</Text>
                <Text style={s.settingsDesc}>সব চ্যাট স্থায়ীভাবে Firebase থেকে মুছে যাবে। পুনরুদ্ধার সম্ভব নয়।</Text>
              </View>
            </Pressable>

            <View style={s.settingsInfoBox}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
              <Text style={s.settingsInfoText}>৭ দিনের পুরনো মেসেজ স্বয়ংক্রিয়ভাবে মুছে যায়। শুধুমাত্র শেষ ৭ দিনের মেসেজ সংরক্ষিত থাকে।</Text>
            </View>

            <Pressable style={[s.settingsItem, { borderBottomWidth: 0 }]} onPress={() => setShowSettings(false)}>
              <View style={[s.settingsIcon, { backgroundColor: '#F4F5F7' }]}>
                <Ionicons name="close-outline" size={22} color={Colors.textMuted} />
              </View>
              <View style={s.settingsItemContent}>
                <Text style={[s.settingsLabel, { color: Colors.textMuted }]}>বন্ধ করুন</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  settingsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5',
    borderRadius: 22, paddingHorizontal: 14, height: 40, gap: 8,
  },
  searchInput: {
    flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, height: 40,
  },
  listContent: { flexGrow: 1 },
  chatItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingVertical: 14, gap: 12,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  chatContent: { flex: 1, gap: 2 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, flex: 1, marginRight: 8 },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  settingsSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB',
    alignSelf: 'center', marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary,
    textAlign: 'center', marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#F0F2F5',
  },
  settingsIcon: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
  },
  settingsItemContent: { flex: 1 },
  settingsLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  settingsDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },
  settingsInfoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.primaryLight, borderRadius: 12,
    padding: 14, marginVertical: 12,
  },
  settingsInfoText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18 },
});
