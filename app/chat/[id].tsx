import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Platform } from 'react-native';
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
  const { user, chatThreads, sendMessage } = useApp();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
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
    if (success) {
      setText('');
    }
    setSending(false);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleOther]}>
          <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.text}</Text>
          <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>
            {new Date(item.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
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
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
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
  messagesList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  msgRow: { flexDirection: 'row', marginBottom: 8 },
  msgRowMe: { justifyContent: 'flex-end' },
  msgBubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  msgBubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgBubbleOther: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, lineHeight: 20 },
  msgTextMe: { color: '#FFFFFF' },
  msgTime: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  msgTimeMe: { color: 'rgba(255,255,255,0.7)' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 12 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingTop: 8, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: Colors.borderLight },
  inputWrapper: { flex: 1, backgroundColor: Colors.inputBg, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, maxHeight: 100, borderWidth: 1, borderColor: Colors.borderLight },
  textInput: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary, maxHeight: 80 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
