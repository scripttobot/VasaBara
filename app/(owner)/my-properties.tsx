import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { Property } from '@/constants/types';
import * as Haptics from 'expo-haptics';

export default function MyPropertiesScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
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
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, !item.available && styles.cardInactive]}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
    >
      <View style={[styles.cardImage, { backgroundColor: colors.inputBg }]}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.cardImageImg} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={24} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.available ? colors.successLight : colors.dangerLight }]}>
            <Text style={[styles.statusText, { color: item.available ? colors.success : colors.danger }]}>
              {item.available ? 'Active' : 'Paused'}
            </Text>
          </View>
        </View>
        <Text style={[styles.cardPrice, { color: colors.secondary }]}>{'\u09F3'}{item.rent.toLocaleString()}/মাস</Text>
        <View style={styles.cardStats}>
          <View style={styles.cardStat}>
            <Ionicons name="eye-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.cardStatText, { color: colors.textMuted }]}>{item.views}</Text>
          </View>
          <View style={styles.cardStat}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.cardStatText, { color: colors.textMuted }]}>0</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <Pressable style={styles.actionBtn} onPress={() => handleToggle(item.id)}>
            <Ionicons name={item.available ? 'pause-circle-outline' : 'play-circle-outline'} size={20} color={item.available ? colors.accent : colors.success} />
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => router.push({ pathname: '/edit-property', params: { id: item.id } })}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>আমার প্রপার্টি</Text>
        <Text style={[styles.headerCount, { color: colors.textSecondary }]}>{ownerProps.length} টি</Text>
      </View>

      <FlatList
        data={ownerProps}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>কোনো প্রপার্টি নেই</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Add ট্যাব থেকে প্রপার্টি যোগ করুন</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24, paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  headerCount: { fontSize: 14, fontFamily: 'Inter_500Medium', paddingBottom: 2 },
  listContent: { flexGrow: 1, padding: 16, gap: 12, paddingBottom: 100 },
  card: {
    flexDirection: 'row', borderRadius: 14,
    borderWidth: 1, overflow: 'hidden',
  },
  cardInactive: { opacity: 0.65 },
  cardImage: { width: 100, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardImageImg: { width: 100, height: '100%' },
  cardContent: { flex: 1, padding: 12, gap: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  cardPrice: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  cardStats: { flexDirection: 'row', gap: 12 },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardStatText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: { padding: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
