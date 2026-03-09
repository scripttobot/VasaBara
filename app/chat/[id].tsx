import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Platform, Modal, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChatMessage } from '@/constants/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, chatThreads, sendMessage, deleteMessage, editMessage, deleteAllChatMessages } = useApp();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ChatMessage | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const thread = chatThreads.find(t => t.id === id);
  const otherName = thread
    ? thread.participantNames.find((n, i) => thread.participantIds[i] !== user?.id) || 'ব্যবহারকারী'
    : 'ব্যবহারকারী';

  const initials = otherName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'chats', id, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs: ChatMessage[] = [];
      snap.forEach(d => msgs.push({ ...d.data(), id: d.id } as ChatMessage));
      setMessages(msgs);
    }, (err) => {
      console.error('Error listening to messages:', err);
    });
    return () => unsub();
  }, [id]);

  const handleSend = async (msgText?: string) => {
    const finalText = msgText || text;
    if (!finalText.trim() || sending) return;
    setSending(true);
    const success = await sendMessage(id!, finalText.trim());
    if (success && !msgText) setText('');
    setSending(false);
  };

  const handleLongPress = (msg: ChatMessage) => {
    if (msg.deleted) return;
    setSelectedMsg(msg);
    setShowActions(true);
  };

  const handleDeleteForMe = async () => {
    if (!selectedMsg) return;
    setShowActions(false);
    await deleteMessage(id!, selectedMsg.id, false);
    setSelectedMsg(null);
  };

  const handleDeleteForEveryone = async () => {
    if (!selectedMsg) return;
    setShowActions(false);
    await deleteMessage(id!, selectedMsg.id, true);
    setSelectedMsg(null);
  };

  const handleStartEdit = () => {
    if (!selectedMsg) return;
    setShowActions(false);
    setEditText(selectedMsg.text);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMsg || !editText.trim()) return;
    await editMessage(id!, selectedMsg.id, editText);
    setEditMode(false);
    setEditText('');
    setSelectedMsg(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditText('');
    setSelectedMsg(null);
  };

  const handleDeleteConversation = () => {
    setShowSettings(false);
    Alert.alert('কথোপকথন মুছুন', 'আপনি কি এই কথোপকথন মুছে ফেলতে চান? এটি শুধুমাত্র আপনার জন্য মুছে যাবে।', [
      { text: 'না', style: 'cancel' },
      { text: 'হ্যাঁ, মুছুন', style: 'destructive', onPress: async () => {
        await deleteAllChatMessages(id!);
        router.back();
      }},
    ]);
  };

  const handleReport = () => {
    setShowSettings(false);
    Alert.alert('রিপোর্ট করুন', 'আপনি কি এই ব্যবহারকারীকে রিপোর্ট করতে চান?', [
      { text: 'না', style: 'cancel' },
      { text: 'হ্যাঁ, রিপোর্ট করুন', style: 'destructive', onPress: () => {
        Alert.alert('রিপোর্ট সফল', 'আপনার রিপোর্ট জমা হয়েছে। আমরা পর্যালোচনা করব।');
      }},
    ]);
  };

  const visibleMessages = messages.filter(msg => {
    if (msg.deletedForUsers?.includes(user?.id || '')) return false;
    return true;
  });

  const quickReplies = [
    `হ্যালো, ${otherName.split(' ')[0]}!`,
    `Hi ${otherName.split(' ')[0]}!`,
    'আমি এই বাসার ব্যাপারে জানতে চাই',
    'ভাড়া কত?',
  ];

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === user?.id;

    if (item.deleted) {
      return (
        <View style={[s.msgRow, isMe && s.msgRowMe]}>
          <View style={s.msgBubbleDeleted}>
            <Ionicons name="ban-outline" size={13} color={Colors.textMuted} />
            <Text style={s.deletedText}>এই মেসেজটি মুছে ফেলা হয়েছে</Text>
          </View>
        </View>
      );
    }

    return (
      <Pressable onLongPress={() => handleLongPress(item)} delayLongPress={400}>
        <View style={[s.msgRow, isMe && s.msgRowMe]}>
          {!isMe && (
            <View style={s.msgAvatarSmall}>
              <Text style={s.msgAvatarSmallText}>{initials}</Text>
            </View>
          )}
          <View style={[s.msgBubble, isMe ? s.msgBubbleMe : s.msgBubbleOther]}>
            <Text style={[s.msgText, isMe && s.msgTextMe]}>{item.text}</Text>
            <View style={s.msgMeta}>
              {item.edited && (
                <Text style={[s.editedLabel, isMe && s.editedLabelMe]}>সম্পাদিত</Text>
              )}
              <Text style={[s.msgTime, isMe && s.msgTimeMe]}>
                {new Date(item.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: Platform.OS === 'web' ? 67 + insets.top : insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </Pressable>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>{initials}</Text>
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName} numberOfLines={1}>{otherName}</Text>
          {thread?.propertyTitle && (
            <Text style={s.headerProperty} numberOfLines={1}>{thread.propertyTitle}</Text>
          )}
        </View>
        <Pressable onPress={() => setShowSettings(true)} style={s.settingsBtn} hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={visibleMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={[s.messagesList, visibleMessages.length === 0 && { flex: 1 }]}
        onContentSizeChange={() => {
          if (visibleMessages.length > 0) flatListRef.current?.scrollToEnd({ animated: true });
        }}
        ListEmptyComponent={
          <View style={s.emptyCenter}>
            <View style={s.emptyAvatar}>
              <Text style={s.emptyAvatarText}>{initials}</Text>
            </View>
            <Text style={s.emptyName}>{otherName}</Text>
            {thread?.propertyTitle && (
              <Text style={s.emptyPropertyTitle}>{thread.propertyTitle}</Text>
            )}
            <Pressable style={s.viewProfileBtn}>
              <Text style={s.viewProfileText}>View profile</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={null}
      />

      {visibleMessages.length === 0 && !editMode && (
        <View style={s.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.quickRepliesScroll}>
            {quickReplies.map((qr, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [s.quickReplyChip, pressed && { opacity: 0.7 }]}
                onPress={() => handleSend(qr)}
              >
                <Text style={s.quickReplyText}>{qr}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {editMode ? (
        <View style={[s.inputBar, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 8) }]}>
          <View style={s.editBar}>
            <View style={s.editLabelRow}>
              <Ionicons name="pencil" size={14} color={Colors.primary} />
              <Text style={s.editLabelText}>মেসেজ সম্পাদনা</Text>
            </View>
            <Pressable onPress={handleCancelEdit} hitSlop={8}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>
          <View style={s.inputRow}>
            <View style={s.inputWrapperEdit}>
              <TextInput
                style={s.textInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                maxLength={500}
              />
            </View>
            <Pressable style={[s.sendBtn, !editText.trim() && s.sendBtnDisabled]} onPress={handleSaveEdit} disabled={!editText.trim()}>
              <Ionicons name="checkmark" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={[s.inputBar, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 8) }]}>
          <View style={s.inputRow}>
            <View style={s.inputWrapper}>
              <TextInput
                style={s.textInput}
                value={text}
                onChangeText={setText}
                placeholder="Message"
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={500}
              />
            </View>
            {text.trim() ? (
              <Pressable style={s.sendBtn} onPress={() => handleSend()} disabled={sending}>
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </Pressable>
            ) : (
              <Pressable style={s.likeBtn} onPress={() => handleSend('👍')}>
                <Ionicons name="thumbs-up" size={26} color={Colors.primary} />
              </Pressable>
            )}
          </View>
        </View>
      )}

      <Modal visible={showActions} transparent animationType="fade" onRequestClose={() => setShowActions(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={[s.actionSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={s.sheetHandle} />

            {selectedMsg?.senderId === user?.id && (
              <Pressable style={s.actionItem} onPress={handleStartEdit}>
                <View style={[s.actionIcon, { backgroundColor: '#EDF2FF' }]}>
                  <Ionicons name="pencil-outline" size={20} color="#4C6FFF" />
                </View>
                <Text style={s.actionText}>এডিট করুন</Text>
              </Pressable>
            )}

            <Pressable style={s.actionItem} onPress={handleDeleteForMe}>
              <View style={[s.actionIcon, { backgroundColor: '#FFF0F0' }]}>
                <Ionicons name="eye-off-outline" size={20} color={Colors.textSecondary} />
              </View>
              <Text style={s.actionText}>আমার জন্য মুছুন</Text>
            </Pressable>

            {selectedMsg?.senderId === user?.id && (
              <Pressable style={s.actionItem} onPress={handleDeleteForEveryone}>
                <View style={[s.actionIcon, { backgroundColor: '#FFF0F0' }]}>
                  <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                </View>
                <Text style={[s.actionText, { color: Colors.danger }]}>সবার জন্য মুছুন</Text>
              </Pressable>
            )}

            <Pressable style={[s.actionItem, { borderBottomWidth: 0 }]} onPress={() => setShowActions(false)}>
              <View style={[s.actionIcon, { backgroundColor: '#F4F5F7' }]}>
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </View>
              <Text style={[s.actionText, { color: Colors.textMuted }]}>বাতিল</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showSettings} transparent animationType="slide" onRequestClose={() => setShowSettings(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setShowSettings(false)}>
          <View style={[s.settingsSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={s.sheetHandle} />
            <Text style={s.settingsTitle}>চ্যাট সেটিংস</Text>

            <Pressable style={s.settingsItem} onPress={handleDeleteConversation}>
              <View style={[s.settingsIcon, { backgroundColor: '#FFF0F0' }]}>
                <Ionicons name="trash-outline" size={22} color={Colors.danger} />
              </View>
              <View style={s.settingsItemText}>
                <Text style={[s.settingsLabel, { color: Colors.danger }]}>কথোপকথন মুছুন</Text>
                <Text style={s.settingsDesc}>এই চ্যাটের সব মেসেজ আপনার জন্য মুছে যাবে</Text>
              </View>
            </Pressable>

            <Pressable style={s.settingsItem} onPress={handleReport}>
              <View style={[s.settingsIcon, { backgroundColor: '#FFF8E6' }]}>
                <Ionicons name="flag-outline" size={22} color="#E6A817" />
              </View>
              <View style={s.settingsItemText}>
                <Text style={s.settingsLabel}>রিপোর্ট করুন</Text>
                <Text style={s.settingsDesc}>এই ব্যবহারকারীকে রিপোর্ট করুন</Text>
              </View>
            </Pressable>

            <Pressable style={[s.settingsItem, { borderBottomWidth: 0 }]} onPress={() => setShowSettings(false)}>
              <View style={[s.settingsIcon, { backgroundColor: '#F4F5F7' }]}>
                <Ionicons name="close-outline" size={22} color={Colors.textMuted} />
              </View>
              <View style={s.settingsItemText}>
                <Text style={[s.settingsLabel, { color: Colors.textMuted }]}>বাতিল</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
    paddingVertical: 10, backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginLeft: 2,
  },
  headerAvatarText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  headerProperty: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 1 },
  settingsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  messagesList: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },

  msgRow: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end' },
  msgRowMe: { justifyContent: 'flex-end' },
  msgAvatarSmall: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 6, marginBottom: 2,
  },
  msgAvatarSmallText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  msgBubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  msgBubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgBubbleOther: { backgroundColor: '#F0F0F0', borderBottomLeftRadius: 4 },
  msgBubbleDeleted: {
    backgroundColor: 'transparent', borderRadius: 14, flexDirection: 'row',
    alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6,
  },
  deletedText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, fontStyle: 'italic' },
  msgText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#1C1E21', lineHeight: 20 },
  msgTextMe: { color: '#FFFFFF' },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3, justifyContent: 'flex-end' },
  editedLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted, fontStyle: 'italic' },
  editedLabelMe: { color: 'rgba(255,255,255,0.6)' },
  msgTime: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  msgTimeMe: { color: 'rgba(255,255,255,0.7)' },

  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyAvatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyAvatarText: { fontSize: 32, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  emptyName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 4 },
  emptyPropertyTitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginBottom: 12 },
  viewProfileBtn: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#CCD0D5',
  },
  viewProfileText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },

  quickRepliesContainer: { paddingBottom: 4, backgroundColor: '#FFFFFF' },
  quickRepliesScroll: { paddingHorizontal: 12, gap: 8 },
  quickReplyChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: '#CCD0D5', backgroundColor: '#FFFFFF',
  },
  quickReplyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },

  inputBar: { paddingHorizontal: 8, paddingTop: 6, backgroundColor: '#FFFFFF', borderTopWidth: 0.5, borderTopColor: '#E4E6EB' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  editBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 6, paddingHorizontal: 4, borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight, marginBottom: 6,
  },
  editLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editLabelText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary },
  inputWrapper: {
    flex: 1, backgroundColor: '#F0F2F5', borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, marginRight: 6,
    maxHeight: 100,
  },
  inputWrapperEdit: {
    flex: 1, backgroundColor: '#F0F2F5', borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, marginRight: 6,
    maxHeight: 100,
  },
  textInput: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, maxHeight: 80 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },
  sendBtnDisabled: { opacity: 0.4 },
  likeBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 2,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB',
    alignSelf: 'center', marginBottom: 16,
  },
  actionSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12,
  },
  actionItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#F0F2F5',
  },
  actionIcon: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  actionText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },

  settingsSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 12,
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
  settingsItemText: { flex: 1 },
  settingsLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  settingsDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },
});
