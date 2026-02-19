import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, FlatList, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, GENDER_PREFERENCES, DIVISIONS } from '@/constants/locations';
import { Property } from '@/constants/types';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
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
      style={({ pressed }) => [styles.resultCard, pressed && { opacity: 0.95 }]}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
    >
      <View style={styles.resultImage}>
        <Ionicons name="image-outline" size={24} color={Colors.textMuted} />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.resultLocation}>
          <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
          <Text style={styles.resultLocationText} numberOfLines={1}>{item.address}</Text>
        </View>
        <View style={styles.resultBottom}>
          <Text style={styles.resultPrice}>{'\u09F3'}{item.rent.toLocaleString()}/মাস</Text>
          <View style={styles.resultFeatures}>
            {item.bedrooms > 0 && <Text style={styles.resultFeature}>{item.bedrooms} Bed</Text>}
            <Text style={styles.resultFeature}>{item.bathrooms} Bath</Text>
          </View>
        </View>
      </View>
      <Pressable style={styles.resultSaveBtn} onPress={() => toggleSaveProperty(item.id)}>
        <Ionicons name={isPropertySaved(item.id) ? 'heart' : 'heart-outline'} size={20} color={isPropertySaved(item.id) ? Colors.danger : Colors.textMuted} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <View style={styles.searchRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchTextInput}
              placeholder="এলাকা, বাসার ধরন..."
              placeholderTextColor={Colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {!!query && (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={20} color={showFilters ? '#FFFFFF' : Colors.primary} />
          </Pressable>
        </View>

        {showFilters && (
          <ScrollView horizontal={false} style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>বাসার ধরন</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterChipRow}>
                  {PROPERTY_TYPES.map(t => (
                    <Pressable
                      key={t.id}
                      style={[styles.filterChip, selectedType === t.id && styles.filterChipActive]}
                      onPress={() => setSelectedType(selectedType === t.id ? '' : t.id)}
                    >
                      <Text style={[styles.filterChipText, selectedType === t.id && styles.filterChipTextActive]}>{t.nameBn}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>বেডরুম (কমপক্ষে)</Text>
              <View style={styles.filterChipRow}>
                {[1, 2, 3, 4].map(n => (
                  <Pressable
                    key={n}
                    style={[styles.filterChip, minBedrooms === n && styles.filterChipActive]}
                    onPress={() => setMinBedrooms(minBedrooms === n ? 0 : n)}
                  >
                    <Text style={[styles.filterChipText, minBedrooms === n && styles.filterChipTextActive]}>{n}+</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>সর্বোচ্চ ভাড়া</Text>
              <View style={styles.filterChipRow}>
                {[10000, 20000, 30000, 50000].map(n => (
                  <Pressable
                    key={n}
                    style={[styles.filterChip, maxRent === n && styles.filterChipActive]}
                    onPress={() => setMaxRent(maxRent === n ? 0 : n)}
                  >
                    <Text style={[styles.filterChipText, maxRent === n && styles.filterChipTextActive]}>{'\u09F3'}{(n / 1000)}K</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>ফার্নিশিং</Text>
              <View style={styles.filterChipRow}>
                {FURNISHING_OPTIONS.map(f => (
                  <Pressable
                    key={f.id}
                    style={[styles.filterChip, selectedFurnishing === f.id && styles.filterChipActive]}
                    onPress={() => setSelectedFurnishing(selectedFurnishing === f.id ? '' : f.id)}
                  >
                    <Text style={[styles.filterChipText, selectedFurnishing === f.id && styles.filterChipTextActive]}>{f.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>ভাড়াটিয়া</Text>
              <View style={styles.filterChipRow}>
                {GENDER_PREFERENCES.map(g => (
                  <Pressable
                    key={g.id}
                    style={[styles.filterChip, selectedGender === g.id && styles.filterChipActive]}
                    onPress={() => setSelectedGender(selectedGender === g.id ? '' : g.id)}
                  >
                    <Text style={[styles.filterChipText, selectedGender === g.id && styles.filterChipTextActive]}>{g.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {hasActiveFilters && (
              <Pressable style={styles.clearBtn} onPress={clearFilters}>
                <Ionicons name="close-circle-outline" size={16} color={Colors.danger} />
                <Text style={styles.clearBtnText}>ফিল্টার মুছুন</Text>
              </Pressable>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>{filteredProperties.length} টি ফলাফল</Text>
      </View>

      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>কোনো ফলাফল নেই</Text>
            <Text style={styles.emptySubtitle}>অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  searchInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
    borderRadius: 12, paddingHorizontal: 12, height: 44, gap: 8, borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchTextInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  filterToggle: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  filterToggleActive: { backgroundColor: Colors.primary },
  filtersContainer: { marginTop: 12, maxHeight: 280 },
  filterSection: { marginBottom: 14 },
  filterLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, marginBottom: 8 },
  filterChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.inputBg, borderWidth: 1, borderColor: Colors.borderLight,
  },
  filterChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primary },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8 },
  clearBtnText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.danger },
  resultHeader: { paddingHorizontal: 24, paddingVertical: 10 },
  resultCount: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  listContent: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 },
  resultCard: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14,
    marginBottom: 10, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  resultImage: {
    width: 90, backgroundColor: '#EDF2F7', alignItems: 'center', justifyContent: 'center',
  },
  resultContent: { flex: 1, padding: 12, gap: 4 },
  resultTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  resultLocation: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  resultLocationText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, flex: 1 },
  resultBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  resultPrice: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.primary },
  resultFeatures: { flexDirection: 'row', gap: 8 },
  resultFeature: { fontSize: 11, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  resultSaveBtn: { padding: 12, alignSelf: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
