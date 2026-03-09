import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { Property } from '@/constants/types';
import * as Haptics from 'expo-haptics';

export default function MyPropertiesScreen() {
  const insets = useSafeAreaInsets();
  const { getOwnerProperties, togglePropertyAvailability, deleteProperty } = useApp();
  const ownerProps = getOwnerProperties();

  const handleDelete = (id: string) => {
    Alert.alert('মুছে ফেলুন', 'আপনি কি এই প্রপার্টি মুছে ফেলতে চান?', [
      { text: 'না', style: 'cancel' },
      {
        text: 'হ্যাঁ', style: 'destructive', onPress: () => {
          if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteProperty(id);
        },
      },
    ]);
  };

  const handleToggle = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    togglePropertyAvailability(id);
  };

  const renderItem = ({ item }: { item: Property }) => (
    <Pressable
      style={[styles.card, !item.available && styles.cardInactive]}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
    >
      <View style={styles.cardImage}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.cardImageImg} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={24} color={Colors.textMuted} />
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.available ? Colors.successLight : Colors.dangerLight }]}>
            <Text style={[styles.statusText, { color: item.available ? Colors.success : Colors.danger }]}>
              {item.available ? 'Active' : 'Paused'}
            </Text>
          </View>
        </View>
        <Text style={styles.cardPrice}>{'\u09F3'}{item.rent.toLocaleString()}/মাস</Text>
        <View style={styles.cardStats}>
          <View style={styles.cardStat}>
            <Ionicons name="eye-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.cardStatText}>{item.views}</Text>
          </View>
          <View style={styles.cardStat}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.cardStatText}>0</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <Pressable style={styles.actionBtn} onPress={() => handleToggle(item.id)}>
            <Ionicons name={item.available ? 'pause-circle-outline' : 'play-circle-outline'} size={20} color={item.available ? Colors.accent : Colors.success} />
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => router.push({ pathname: '/edit-property', params: { id: item.id } })}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.headerTitle}>আমার প্রপার্টি</Text>
        <Text style={styles.headerCount}>{ownerProps.length} টি</Text>
      </View>

      <FlatList
        data={ownerProps}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>কোনো প্রপার্টি নেই</Text>
            <Text style={styles.emptySubtitle}>Add ট্যাব থেকে প্রপার্টি যোগ করুন</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 24, paddingBottom: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  headerCount: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, paddingBottom: 2 },
  listContent: { flexGrow: 1, padding: 16, gap: 12, paddingBottom: 100 },
  card: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  cardInactive: { opacity: 0.65 },
  cardImage: { width: 100, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardImageImg: { width: 100, height: '100%' },
  cardContent: { flex: 1, padding: 12, gap: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  cardPrice: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.secondary },
  cardStats: { flexDirection: 'row', gap: 12 },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardStatText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { padding: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
