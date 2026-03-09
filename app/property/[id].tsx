import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Platform, Linking, Alert,
  Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, GENDER_PREFERENCES } from '@/constants/locations';
import * as Haptics from 'expo-haptics';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { getPropertyById, toggleSaveProperty, isPropertySaved, user, createChatThread } = useApp();
  const property = getPropertyById(id);

  if (!property) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>প্রপার্টি পাওয়া যায়নি</Text>
        <Pressable style={[styles.errorBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={styles.errorBtnText}>ফিরে যান</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isPropertySaved(property.id);
  const typeLabel = PROPERTY_TYPES.find(t => t.id === property.type)?.nameBn || property.type;
  const furnishingLabel = FURNISHING_OPTIONS.find(f => f.id === property.furnishing)?.nameBn || property.furnishing;
  const genderLabel = GENDER_PREFERENCES.find(g => g.id === property.genderPreference)?.nameBn || property.genderPreference;

  const handleCall = () => {
    Linking.openURL(`tel:${property.ownerPhone}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/88${property.ownerPhone}`);
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleSaveProperty(property.id);
  };

  const amenities = [
    { key: 'parking', icon: 'car-outline' as const, label: 'পার্কিং', available: property.parking },
    { key: 'gas', icon: 'flame-outline' as const, label: 'গ্যাস', available: property.gasConnection },
    { key: 'water', icon: 'water-outline' as const, label: 'পানি', available: property.waterSupply },
    { key: 'elevator', icon: 'swap-vertical-outline' as const, label: 'লিফট', available: property.elevator },
    { key: 'generator', icon: 'flash-outline' as const, label: 'জেনারেটর', available: property.generator },
    { key: 'security', icon: 'shield-checkmark-outline' as const, label: 'সিকিউরিটি', available: property.security },
  ];

  const hasImages = property.images && property.images.length > 0;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const onImageScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(idx);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.imageContainer, { backgroundColor: colors.inputBg }]}>
          {hasImages ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onImageScroll}
              style={styles.imageScroller}
            >
              {property.images.map((uri, idx) => (
                <Image
                  key={idx}
                  source={{ uri }}
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="images-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.imagePlaceholderText, { color: colors.textMuted }]}>{typeLabel}</Text>
            </View>
          )}

          {hasImages && property.images.length > 1 && (
            <View style={styles.imageDots}>
              {property.images.map((_, idx) => (
                <View key={idx} style={[styles.imageDot, idx === activeImageIndex && styles.imageDotActive]} />
              ))}
            </View>
          )}

          <View style={[styles.topBar, { top: insets.top + (Platform.OS === 'web' ? 67 : 10) }]}>
            <Pressable style={styles.topBarBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View style={styles.topBarRight}>
              <Pressable style={styles.topBarBtn} onPress={handleSave}>
                <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? colors.danger : '#FFFFFF'} />
              </Pressable>
              <Pressable style={styles.topBarBtn}>
                <Ionicons name="share-outline" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {property.verified && (
            <View style={[styles.verifiedTag, { backgroundColor: colors.success }]}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.verifiedTagText}>Verified</Text>
            </View>
          )}

          {hasImages && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>{activeImageIndex + 1}/{property.images.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={[styles.typeChip, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.typeChipText, { color: colors.primary }]}>{typeLabel}</Text>
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{property.title}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>{property.address}</Text>
            </View>
          </View>

          <View style={[styles.priceSection, { backgroundColor: colors.primaryLight }]}>
            <View>
              <Text style={[styles.priceLabel, { color: colors.primaryDark }]}>মাসিক ভাড়া</Text>
              <Text style={[styles.price, { color: colors.primary }]}>{'\u09F3'} {property.rent.toLocaleString()}</Text>
            </View>
            {property.negotiable && (
              <View style={[styles.negotiableBadge, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.negotiableText, { color: colors.accent }]}>আলোচনাসাপেক্ষ</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            {property.bedrooms > 0 && (
              <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                <Ionicons name="bed-outline" size={22} color={colors.primary} />
                <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{property.bedrooms}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>বেডরুম</Text>
              </View>
            )}
            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <Ionicons name="water-outline" size={22} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{property.bathrooms}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>বাথরুম</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <Ionicons name="resize-outline" size={22} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{property.area}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>sqft</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <Ionicons name="layers-outline" size={22} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.textPrimary }]}>{property.floorLevel}/{property.totalFloors}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ফ্লোর</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>বিবরণ</Text>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{property.description}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>বিস্তারিত তথ্য</Text>
            <View style={styles.infoGrid}>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>ফার্নিশিং</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{furnishingLabel}</Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>ভাড়াটিয়া</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{genderLabel}</Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>সিকিউরিটি ডিপোজিট</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{'\u09F3'} {property.deposit.toLocaleString()}</Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>সার্ভিস চার্জ</Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{'\u09F3'} {property.serviceCharge.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>সুবিধাসমূহ</Text>
            <View style={styles.amenityGrid}>
              {amenities.map(a => (
                <View key={a.key} style={[styles.amenityItem, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }, !a.available && { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                  <Ionicons name={a.icon} size={20} color={a.available ? colors.primary : colors.textMuted} />
                  <Text style={[styles.amenityText, { color: colors.primary }, !a.available && { color: colors.textMuted }]}>{a.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.ownerSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>বাড়িওয়ালা</Text>
            <View style={[styles.ownerCard, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <View style={[styles.ownerAvatar, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.ownerInfo}>
                <Text style={[styles.ownerName, { color: colors.textPrimary }]}>{property.ownerName}</Text>
                <Text style={[styles.ownerPhone, { color: colors.textSecondary }]}>{property.ownerPhone}</Text>
              </View>
              {property.verified && (
                <View style={styles.ownerVerified}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[styles.ownerVerifiedText, { color: colors.success }]}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.viewsRow}>
            <Ionicons name="eye-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.viewsText, { color: colors.textMuted }]}>{property.views} বার দেখা হয়েছে</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 10) }]}>
        <Pressable style={({ pressed }) => [styles.callBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.9 }]} onPress={handleCall}>
          <Ionicons name="call" size={20} color="#FFFFFF" />
          <Text style={styles.callBtnText}>কল</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.msgBtn, { backgroundColor: colors.secondary }, pressed && { opacity: 0.9 }]}
          onPress={async () => {
            if (!user) {
              Alert.alert('লগইন প্রয়োজন', 'মেসেজ পাঠাতে লগইন করুন');
              return;
            }
            const chatId = await createChatThread(property.ownerId, property.ownerName, property.id, property.title);
            if (chatId) {
              router.push({ pathname: '/chat/[id]', params: { id: chatId } });
            } else {
              Alert.alert('ত্রুটি', 'চ্যাট শুরু করা যায়নি');
            }
          }}
        >
          <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
          <Text style={styles.msgBtnText}>মেসেজ</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.whatsappBtn, pressed && { opacity: 0.9 }]} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text style={styles.whatsappBtnText}>WhatsApp</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  errorBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  errorBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  imageContainer: { height: 280 },
  imageScroller: { height: 280 },
  propertyImage: { width: SCREEN_WIDTH, height: 280 },
  imagePlaceholder: { height: 280, alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { fontSize: 16, fontFamily: 'Inter_500Medium', marginTop: 8 },
  imageDots: {
    position: 'absolute', bottom: 12, alignSelf: 'center',
    flexDirection: 'row', gap: 6,
  },
  imageDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  imageDotActive: { backgroundColor: '#FFFFFF', width: 20 },
  imageCounter: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  imageCounterText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  topBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  topBarBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  topBarRight: { flexDirection: 'row', gap: 8 },
  verifiedTag: {
    position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4,
  },
  verifiedTagText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  content: { padding: 20 },
  titleSection: { gap: 6, marginBottom: 16 },
  typeChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  typeChipText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', lineHeight: 28 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 14, fontFamily: 'Inter_400Regular', flex: 1 },
  priceSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 16, borderRadius: 14 },
  priceLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  price: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  negotiableBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  negotiableText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statBox: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1,
  },
  statNumber: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  detailSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  descriptionText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  infoGrid: { gap: 10 },
  infoItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amenityItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1,
  },
  amenityText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  ownerSection: { marginBottom: 16 },
  ownerCard: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 14, gap: 12, borderWidth: 1,
  },
  ownerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  ownerInfo: { flex: 1, gap: 2 },
  ownerName: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  ownerPhone: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  ownerVerified: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ownerVerifiedText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  viewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center' },
  viewsText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1,
  },
  callBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 50, borderRadius: 14,
  },
  callBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  msgBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 50, borderRadius: 14,
  },
  msgBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  whatsappBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#25D366', height: 50, borderRadius: 14,
  },
  whatsappBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
