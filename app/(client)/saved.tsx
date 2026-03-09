import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { Property } from '@/constants/types';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { properties, savedProperties, toggleSaveProperty } = useApp();
  const savedItems = properties.filter(p => savedProperties.includes(p.id));

  const renderItem = ({ item }: { item: Property }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
    >
      <View style={styles.cardImage}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.cardImageImg} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={28} color={Colors.textMuted} />
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardLocation}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text style={styles.cardLocationText} numberOfLines={1}>{item.upazila}, {item.district}</Text>
        </View>
        <Text style={styles.cardPrice}>{'\u09F3'}{item.rent.toLocaleString()}/মাস</Text>
      </View>
      <Pressable style={styles.removeBtn} onPress={() => toggleSaveProperty(item.id)}>
        <Ionicons name="heart" size={22} color={Colors.danger} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.headerTitle}>সংরক্ষিত</Text>
        <Text style={styles.headerCount}>{savedItems.length} টি</Text>
      </View>

      <FlatList
        data={savedItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>কোনো সংরক্ষিত প্রপার্টি নেই</Text>
            <Text style={styles.emptySubtitle}>পছন্দের প্রপার্টিতে হার্ট বাটন চাপুন</Text>
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
  listContent: { flexGrow: 1, padding: 24, gap: 12, paddingBottom: 100 },
  card: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.03)', elevation: 1,
  },
  cardImage: {
    width: 100, height: 100, backgroundColor: '#EDF2F7',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  cardImageImg: {
    width: 100, height: 100,
  },
  cardContent: { flex: 1, padding: 12, justifyContent: 'center', gap: 4 },
  cardTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardLocationText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  cardPrice: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.primary },
  removeBtn: { padding: 12, alignSelf: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, textAlign: 'center' },
});
