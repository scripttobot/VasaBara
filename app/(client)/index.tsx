import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { PROPERTY_TYPES } from '@/constants/locations';
import { Property } from '@/constants/types';
import { ThemeColors } from '@/constants/colors';
import AnimatedPressable from '@/components/AnimatedPressable';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

function PropertyCard({ item, index, onSave, isSaved, colors }: { item: Property; index: number; onSave: () => void; isSaved: boolean; colors: ThemeColors }) {
  const typeLabel = PROPERTY_TYPES.find(t => t.id === item.type)?.nameBn || item.type;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <AnimatedPressable
        onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
        style={{
          backgroundColor: colors.card,
          borderRadius: 18,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden' as const,
        }}
      >
        <View style={{ height: 190, backgroundColor: colors.inputBg }}>
          {item.images && item.images.length > 0 ? (
            <Image source={{ uri: item.images[0] }} style={{ width: '100%', height: 190 }} resizeMode="cover" />
          ) : (
            <View style={{ height: 190, backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="image-outline" size={40} color={colors.textMuted} />
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.textMuted, marginTop: 4 }}>{typeLabel}</Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.35)']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70 }}
          />
          {item.verified && (
            <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 }}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>Verified</Text>
            </View>
          )}
          {item.featured && (
            <View style={{ position: 'absolute', top: 12, right: 52, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 }}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' }}>Featured</Text>
            </View>
          )}
          <Pressable
            style={{ position: 'absolute', top: 10, right: 10, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}
            onPress={onSave}
          >
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? colors.danger : '#FFFFFF'} />
          </Pressable>
        </View>

        <View style={{ padding: 14, gap: 6 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary }} numberOfLines={1}>{item.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.textSecondary, flex: 1 }} numberOfLines={1}>{item.address}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter_700Bold', color: colors.primary }}>{'\u09F3'}{item.rent.toLocaleString()}<Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: colors.textSecondary }}>/মাস</Text></Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {item.bedrooms > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="bed-outline" size={14} color={colors.textMuted} />
                  <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.textMuted }}>{item.bedrooms}</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="water-outline" size={14} color={colors.textMuted} />
                <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.textMuted }}>{item.bathrooms}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Ionicons name="resize-outline" size={14} color={colors.textMuted} />
                <Text style={{ fontSize: 12, fontFamily: 'Inter_500Medium', color: colors.textMuted }}>{item.area}</Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function ClientHomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { properties, toggleSaveProperty, isPropertySaved, unreadNotificationCount } = useApp();
  const featuredProperties = properties.filter(p => p.featured && p.available);
  const nearbyProperties = properties.filter(p => p.available);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={colors.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <View>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)' }}>আসসালামু আলাইকুম</Text>
              <Text style={{ fontSize: 26, fontFamily: 'Inter_700Bold', color: '#FFFFFF' }}>বাসা খুঁজুন</Text>
            </View>
            <AnimatedPressable
              onPress={() => router.push('/notifications')}
              style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              {unreadNotificationCount > 0 && (
                <View style={{ position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                  <Text style={{ fontSize: 10, fontFamily: 'Inter_700Bold', color: '#FFFFFF' }}>{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</Text>
                </View>
              )}
            </AnimatedPressable>
          </View>

          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 14,
              paddingHorizontal: 16,
              height: 50,
              gap: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
            }}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={{ flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' }}>এলাকা, বাসার ধরন অনুসন্ধান করুন...</Text>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="options" size={18} color="#FFFFFF" />
            </View>
          </Pressable>
        </LinearGradient>

        <View style={{ paddingHorizontal: 24, marginTop: 22 }}>
          <Text style={{ fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary, marginBottom: 14 }}>ক্যাটাগরি</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
            {PROPERTY_TYPES.map(type => (
              <AnimatedPressable
                key={type.id}
                onPress={() => router.push('/search')}
                style={{ alignItems: 'center', gap: 8, width: 76 }}
                scaleValue={0.92}
              >
                <LinearGradient
                  colors={[colors.primary + '20', colors.primary + '08']}
                  style={{ width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primary + '20' }}
                >
                  <Ionicons name={type.icon as any} size={24} color={colors.primary} />
                </LinearGradient>
                <Text style={{ fontSize: 11, fontFamily: 'Inter_500Medium', color: colors.textSecondary, textAlign: 'center' }}>{type.nameBn}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </View>

        {featuredProperties.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginTop: 26 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary }}>ফিচার্ড প্রপার্টি</Text>
              <Pressable onPress={() => router.push('/search')}>
                <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.primary }}>সবগুলো দেখুন</Text>
              </Pressable>
            </View>
            {featuredProperties.map((item, index) => (
              <PropertyCard
                key={item.id}
                item={item}
                index={index}
                onSave={() => toggleSaveProperty(item.id)}
                isSaved={isPropertySaved(item.id)}
                colors={colors}
              />
            ))}
          </View>
        )}

        <View style={{ paddingHorizontal: 24, marginTop: 26 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.textPrimary }}>সাম্প্রতিক প্রপার্টি</Text>
            <Pressable onPress={() => router.push('/search')}>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: colors.primary }}>সবগুলো দেখুন</Text>
            </Pressable>
          </View>
          {nearbyProperties.slice(0, 5).map((item, index) => (
            <PropertyCard
              key={item.id}
              item={item}
              index={index}
              onSave={() => toggleSaveProperty(item.id)}
              isSaved={isPropertySaved(item.id)}
              colors={colors}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
