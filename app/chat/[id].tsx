import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Platform, Modal, Alert } from 'react-native';
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
  const [showMenu, setShowMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const thread = chatThreads.find(t => t.id === id);
  const otherName = thread
    ? thread.participantNames.find((n, i) => thread.participantIds[i] !== user?.id) || 'ব্যবহারকারী'
    : 'ব্যবহারকারী';

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

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const msgText = text;
    setSending(true);
    const success = await sendMessage(id!, msgText);
    if (success) setText('');
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

  const handleDeleteAll = () => {
    setShowMenu(false);
    Alert.alert('সব মেসেজ মুছুন', 'আপনি কি এই চ্যাটের সব মেসেজ মুছে ফেলতে চান?', [
      { text: 'না', style: 'cancel' },
      { text: 'হ্যাঁ, মুছুন', style: 'destructive', onPress: () => deleteAllChatMessages(id!) },
    ]);
  };

  const visibleMessages = messages.filter(msg => {
    if (msg.deletedForUsers?.includes(user?.id || '')) return false;
    return true;
  });

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === user?.id;

    if (item.deleted) {
      return (
        <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
          <View style={[styles.msgBubble, styles.msgBubbleDeleted]}>
            <Ionicons name="ban-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.deletedText}>এই মেসেজটি মুছে ফেলা হয়েছে</Text>
          </View>
        </View>
      );
    }

    return (
      <Pressable onLongPress={() => handleLongPress(item)} delayLongPress={400}>
        <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
          <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleOther]}>
            <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.text}</Text>
            <View style={styles.msgMeta}>
              {item.edited && (
                <Text style={[styles.editedLabel, isMe && styles.editedLabelMe]}>সম্পাদিত</Text>
              )}
              <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>
                {new Date(item.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'web' ? 67 + insets.top : insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{otherName}</Text>
          {thread?.propertyTitle && (
            <Text style={styles.headerProperty} numberOfLines={1}>{thread.propertyTitle}</Text>
          )}
        </View>
        <Pressable onPress={() => setShowMenu(true)} style={styles.menuBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={visibleMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>কথোপকথন শুরু করুন</Text>
          </View>
        }
      />

      {editMode ? (
        <View style={[styles.inputBar, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 12) }]}>
          <View style={styles.editBar}>
            <View style={styles.editLabel}>
              <Ionicons name="pencil" size={14} color={Colors.primary} />
              <Text style={styles.editLabelText}>মেসেজ সম্পাদনা</Text>
            </View>
            <Pressable onPress={handleCancelEdit}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>
          <View style={styles.editInputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                multiline
                maxLength={500}
              />
            </View>
            <Pressable style={[styles.sendBtn, !editText.trim() && styles.sendBtnDisabled]} onPress={handleSaveEdit} disabled={!editText.trim()}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={[styles.inputBar, { paddingBottom: Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="মেসেজ লিখুন..."
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={500}
            />
          </View>
          <Pressable style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]} onPress={handleSend} disabled={!text.trim() || sending}>
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      <Modal visible={showActions} transparent animationType="fade" onRequestClose={() => setShowActions(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowActions(false)}>
          <View style={styles.actionSheet}>
            <Text style={styles.actionTitle}>মেসেজ অপশন</Text>

            {selectedMsg?.senderId === user?.id && (
              <Pressable style={styles.actionItem} onPress={handleStartEdit}>
                <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
                <Text style={styles.actionText}>এডিট করুন</Text>
              </Pressable>
            )}

            <Pressable style={styles.actionItem} onPress={handleDeleteForMe}>
              <Ionicons name="eye-off-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.actionText}>আমার জন্য মুছুন</Text>
            </Pressable>

            {selectedMsg?.senderId === user?.id && (
              <Pressable style={styles.actionItem} onPress={handleDeleteForEveryone}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                <Text style={[styles.actionText, { color: Colors.danger }]}>সবার জন্য মুছুন</Text>
              </Pressable>
            )}

            <Pressable style={[styles.actionItem, styles.actionCancel]} onPress={() => setShowActions(false)}>
              <Text style={styles.actionCancelText}>বাতিল</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.actionSheet}>
            <Pressable style={styles.actionItem} onPress={handleDeleteAll}>
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              <Text style={[styles.actionText, { color: Colors.danger }]}>সব মেসেজ মুছুন</Text>
            </Pressable>
            <Pressable style={[styles.actionItem, styles.actionCancel]} onPress={() => setShowMenu(false)}>
              <Text style={styles.actionCancelText}>বাতিল</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginLeft: 4 },
  headerName: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  headerProperty: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },
  menuBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  messagesList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  msgRow: { flexDirection: 'row', marginBottom: 8 },
  msgRowMe: { justifyContent: 'flex-end' },
  msgBubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  msgBubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgBubbleOther: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  msgBubbleDeleted: { backgroundColor: '#F0F0F0', borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  deletedText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, fontStyle: 'italic' },
  msgText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 20 },
  msgTextMe: { color: '#FFFFFF' },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, justifyContent: 'flex-end' },
  editedLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', color: Colors.textMuted, fontStyle: 'italic' },
  editedLabelMe: { color: 'rgba(255,255,255,0.6)' },
  msgTime: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, alignSelf: 'flex-end' },
  msgTimeMe: { color: 'rgba(255,255,255,0.7)' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 12 },
  inputBar: { paddingHorizontal: 12, paddingTop: 8, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: Colors.borderLight },
  editBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, marginBottom: 8 },
  editLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editLabelText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary },
  editInputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  inputWrapper: { flex: 1, backgroundColor: Colors.inputBg, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, maxHeight: 100, borderWidth: 1, borderColor: Colors.borderLight },
  textInput: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, maxHeight: 80 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  actionSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 34 },
  actionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  actionText: { fontSize: 15, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  actionCancel: { borderBottomWidth: 0, justifyContent: 'center', marginTop: 8 },
  actionCancelText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textMuted, textAlign: 'center' },
});
