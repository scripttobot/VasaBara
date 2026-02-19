import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { PROPERTY_TYPES } from '@/constants/locations';
import { Property } from '@/constants/types';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

function PropertyCard({ item, index, onSave, isSaved }: { item: Property; index: number; onSave: () => void; isSaved: boolean }) {
  const typeLabel = PROPERTY_TYPES.find(t => t.id === item.type)?.nameBn || item.type;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <Pressable
        style={({ pressed }) => [styles.propertyCard, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
        onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
      >
        <View style={styles.cardImagePlaceholder}>
          <Ionicons name="image-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.cardImageText}>{typeLabel}</Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          <Pressable style={styles.saveBtn} onPress={onSave}>
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? Colors.danger : '#FFFFFF'} />
          </Pressable>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.cardLocation}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.cardLocationText} numberOfLines={1}>{item.address}</Text>
          </View>
          <View style={styles.cardBottom}>
            <Text style={styles.cardPrice}>{'\u09F3'}{item.rent.toLocaleString()}<Text style={styles.cardPriceUnit}>/মাস</Text></Text>
            <View style={styles.cardFeatures}>
              {item.bedrooms > 0 && (
                <View style={styles.featureItem}>
                  <Ionicons name="bed-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.featureText}>{item.bedrooms}</Text>
                </View>
              )}
              <View style={styles.featureItem}>
                <Ionicons name="water-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.featureText}>{item.bathrooms}</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="resize-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.featureText}>{item.area}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ClientHomeScreen() {
  const insets = useSafeAreaInsets();
  const { properties, toggleSaveProperty, isPropertySaved } = useApp();
  const featuredProperties = properties.filter(p => p.featured && p.available);
  const nearbyProperties = properties.filter(p => p.available);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerSection, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>আসসালামু আলাইকুম</Text>
              <Text style={styles.headerTitle}>বাসা খুঁজুন</Text>
            </View>
            <Pressable style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              <View style={styles.notifDot} />
            </Pressable>
          </View>

          <Pressable
            style={styles.searchBar}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <Text style={styles.searchPlaceholder}>এলাকা, বাসার ধরন অনুসন্ধান করুন...</Text>
            <View style={styles.filterBtn}>
              <Ionicons name="options" size={18} color={Colors.primary} />
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ক্যাটাগরি</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {PROPERTY_TYPES.map(type => (
              <Pressable
                key={type.id}
                style={({ pressed }) => [styles.categoryItem, pressed && { opacity: 0.8 }]}
                onPress={() => {
                  router.push('/search');
                }}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={type.icon as any} size={22} color={Colors.primary} />
                </View>
                <Text style={styles.categoryText}>{type.nameBn}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {featuredProperties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ফিচার্ড প্রপার্টি</Text>
              <Pressable onPress={() => router.push('/search')}>
                <Text style={styles.seeAll}>সবগুলো দেখুন</Text>
              </Pressable>
            </View>
            {featuredProperties.map((item, index) => (
              <PropertyCard
                key={item.id}
                item={item}
                index={index}
                onSave={() => toggleSaveProperty(item.id)}
                isSaved={isPropertySaved(item.id)}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>সাম্প্রতিক প্রপার্টি</Text>
            <Pressable onPress={() => router.push('/search')}>
              <Text style={styles.seeAll}>সবগুলো দেখুন</Text>
            </Pressable>
          </View>
          {nearbyProperties.slice(0, 5).map((item, index) => (
            <PropertyCard
              key={item.id}
              item={item}
              index={index}
              onSave={() => toggleSaveProperty(item.id)}
              isSaved={isPropertySaved(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  notifBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.danger },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
    borderRadius: 14, paddingHorizontal: 16, height: 50, gap: 10, borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  filterBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  section: { paddingHorizontal: 24, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  seeAll: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.primary },
  categoryRow: { gap: 12, paddingRight: 24 },
  categoryItem: { alignItems: 'center', gap: 6, width: 72 },
  categoryIcon: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  categoryText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textSecondary, textAlign: 'center' },
  propertyCard: {
    backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardImagePlaceholder: {
    height: 180, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center',
  },
  cardImageText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textMuted, marginTop: 4 },
  verifiedBadge: {
    position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4,
  },
  verifiedText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  featuredBadge: {
    position: 'absolute', top: 12, right: 52, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4,
  },
  featuredText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  saveBtn: {
    position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  cardContent: { padding: 14, gap: 6 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocationText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, flex: 1 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  cardPrice: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.primary },
  cardPriceUnit: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  cardFeatures: { flexDirection: 'row', gap: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  featureText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
});
