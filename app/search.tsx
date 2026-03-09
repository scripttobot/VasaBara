import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, FlatList, Platform, ScrollView, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, GENDER_PREFERENCES } from '@/constants/locations';
import { Property } from '@/constants/types';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { properties, toggleSaveProperty, isPropertySaved } = useApp();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFurnishing, setSelectedFurnishing] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [maxRent, setMaxRent] = useState(0);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      if (!p.available) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.address.toLowerCase().includes(query.toLowerCase()) && !p.upazila.includes(query)) return false;
      if (selectedType && p.type !== selectedType) return false;
      if (selectedFurnishing && p.furnishing !== selectedFurnishing) return false;
      if (selectedGender && p.genderPreference !== selectedGender) return false;
      if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
      if (maxRent > 0 && p.rent > maxRent) return false;
      return true;
    });
  }, [properties, query, selectedType, selectedFurnishing, selectedGender, minBedrooms, maxRent]);

  const clearFilters = () => {
    setSelectedType('');
    setSelectedFurnishing('');
    setSelectedGender('');
    setMinBedrooms(0);
    setMaxRent(0);
  };

  const hasActiveFilters = !!selectedType || !!selectedFurnishing || !!selectedGender || minBedrooms > 0 || maxRent > 0;

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <Pressable
      style={({ pressed }) => [styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { opacity: 0.95 }]}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
    >
      <View style={[styles.resultImage, { backgroundColor: colors.inputBg }]}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.resultImageImg} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={24} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.resultLocation}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={[styles.resultLocationText, { color: colors.textSecondary }]} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.resultBottom}>
          <Text style={[styles.resultPrice, { color: colors.primary }]}>{'\u09F3'}{item.rent.toLocaleString()}/মাস</Text>
          <View style={styles.resultFeatures}>
            {item.bedrooms > 0 && <Text style={[styles.resultFeature, { color: colors.textMuted }]}>{item.bedrooms} Bed</Text>}
            <Text style={[styles.resultFeature, { color: colors.textMuted }]}>{item.bathrooms} Bath</Text>
          </View>
        </View>
      </View>
      <Pressable style={styles.resultSaveBtn} onPress={() => toggleSaveProperty(item.id)}>
        <Ionicons name={isPropertySaved(item.id) ? 'heart' : 'heart-outline'} size={20} color={isPropertySaved(item.id) ? colors.danger : colors.textMuted} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <View style={styles.searchRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={[styles.searchInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchTextInput, { color: colors.textPrimary }]}
              placeholder="এলাকা, বাসার ধরন..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {!!query && (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.filterToggle, { backgroundColor: colors.primaryLight }, showFilters && { backgroundColor: colors.primary }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={20} color={showFilters ? '#FFFFFF' : colors.primary} />
          </Pressable>
        </View>

        {showFilters && (
          <ScrollView horizontal={false} style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>বাসার ধরন</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterChipRow}>
                  {PROPERTY_TYPES.map(t => (
                    <Pressable
                      key={t.id}
                      style={[styles.filterChip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, selectedType === t.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                      onPress={() => setSelectedType(selectedType === t.id ? '' : t.id)}
                    >
                      <Text style={[styles.filterChipText, { color: colors.textSecondary }, selectedType === t.id && { color: colors.primary }]}>{t.nameBn}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>বেডরুম (কমপক্ষে)</Text>
              <View style={styles.filterChipRow}>
                {[1, 2, 3, 4].map(n => (
                  <Pressable
                    key={n}
                    style={[styles.filterChip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, minBedrooms === n && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => setMinBedrooms(minBedrooms === n ? 0 : n)}
                  >
                    <Text style={[styles.filterChipText, { color: colors.textSecondary }, minBedrooms === n && { color: colors.primary }]}>{n}+</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>সর্বোচ্চ ভাড়া</Text>
              <View style={styles.filterChipRow}>
                {[10000, 20000, 30000, 50000].map(n => (
                  <Pressable
                    key={n}
                    style={[styles.filterChip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, maxRent === n && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => setMaxRent(maxRent === n ? 0 : n)}
                  >
                    <Text style={[styles.filterChipText, { color: colors.textSecondary }, maxRent === n && { color: colors.primary }]}>{'\u09F3'}{(n / 1000)}K</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>ফার্নিশিং</Text>
              <View style={styles.filterChipRow}>
                {FURNISHING_OPTIONS.map(f => (
                  <Pressable
                    key={f.id}
                    style={[styles.filterChip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, selectedFurnishing === f.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => setSelectedFurnishing(selectedFurnishing === f.id ? '' : f.id)}
                  >
                    <Text style={[styles.filterChipText, { color: colors.textSecondary }, selectedFurnishing === f.id && { color: colors.primary }]}>{f.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textPrimary }]}>ভাড়াটিয়া</Text>
              <View style={styles.filterChipRow}>
                {GENDER_PREFERENCES.map(g => (
                  <Pressable
                    key={g.id}
                    style={[styles.filterChip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, selectedGender === g.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                    onPress={() => setSelectedGender(selectedGender === g.id ? '' : g.id)}
                  >
                    <Text style={[styles.filterChipText, { color: colors.textSecondary }, selectedGender === g.id && { color: colors.primary }]}>{g.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {hasActiveFilters && (
              <Pressable style={styles.clearBtn} onPress={clearFilters}>
                <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
                <Text style={[styles.clearBtnText, { color: colors.danger }]}>ফিল্টার মুছুন</Text>
              </Pressable>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.resultHeader}>
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>{filteredProperties.length} টি ফলাফল</Text>
      </View>

      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>কোনো ফলাফল নেই</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  searchInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8, borderWidth: 1,
  },
  searchTextInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  filterToggle: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  filtersContainer: { marginTop: 12, maxHeight: 280 },
  filterSection: { marginBottom: 14 },
  filterLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  filterChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  filterChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8 },
  clearBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  resultHeader: { paddingHorizontal: 24, paddingVertical: 10 },
  resultCount: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  listContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 },
  resultCard: {
    flexDirection: 'row', borderRadius: 14,
    marginBottom: 10, borderWidth: 1, overflow: 'hidden',
  },
  resultImage: {
    width: 90, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  resultImageImg: {
    width: 90, height: '100%',
  },
  resultContent: { flex: 1, padding: 12, gap: 4 },
  resultTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  resultLocation: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  resultLocationText: { fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },
  resultBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  resultPrice: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  resultFeatures: { flexDirection: 'row', gap: 8 },
  resultFeature: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  resultSaveBtn: { padding: 12, alignSelf: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});
