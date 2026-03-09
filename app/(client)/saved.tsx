import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { Property } from '@/constants/types';
import AnimatedPressable from '@/components/AnimatedPressable';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { properties, savedProperties, toggleSaveProperty } = useApp();
  const savedItems = properties.filter(p => savedProperties.includes(p.id));

  const renderItem = ({ item, index }: { item: Property; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
      <AnimatedPressable
        onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
        style={{
          flexDirection: 'row' as const,
          backgroundColor: colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden' as const,
        }}
      >
        <View style={{ width: 110, height: 110, backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {item.images && item.images.length > 0 ? (
            <Image source={{ uri: item.images[0] }} style={{ width: 110, height: 110 }} resizeMode="cover" />
          ) : (
            <Ionicons name="image-outline" size={28} color={colors.textMuted} />
          )}
        </View>
        <View style={{ flex: 1, padding: 14, justifyContent: 'center', gap: 5 }}>
          <Text style={{ fontSize: 15, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary }} numberOfLines={1}>{item.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: colors.textSecondary }} numberOfLines={1}>{item.upazila}, {item.district}</Text>
          </View>
          <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: colors.primary }}>{'\u09F3'}{item.rent.toLocaleString()}/মাস</Text>
        </View>
        <AnimatedPressable
          onPress={() => toggleSaveProperty(item.id)}
          style={{ padding: 14, alignSelf: 'center' }}
          scaleValue={0.85}
        >
          <Ionicons name="heart" size={24} color={colors.danger} />
        </AnimatedPressable>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={colors.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 24,
          paddingBottom: 16,
          paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 14),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: '#FFFFFF' }}>সংরক্ষিত</Text>
        <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.8)', paddingBottom: 2 }}>{savedItems.length} টি</Text>
      </LinearGradient>

      <FlatList
        data={savedItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 12, paddingBottom: 100 }}
        scrollEnabled={savedItems.length > 0}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="heart-outline" size={40} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary, marginTop: 4 }}>কোনো সংরক্ষিত প্রপার্টি নেই</Text>
            <Text style={{ fontSize: 14, fontFamily: 'Inter_400Regular', color: colors.textSecondary, textAlign: 'center' }}>পছন্দের প্রপার্টিতে হার্ট বাটন চাপুন</Text>
          </View>
        }
      />
    </View>
  );
}
