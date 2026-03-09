import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/theme-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>অ্যাপ সম্পর্কে</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="home" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>BashVara</Text>
          <Text style={[styles.appNameBn, { color: colors.textSecondary }]}>বাসভাড়া</Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.versionText, { color: colors.primary }]}>সংস্করণ 1.0.0</Text>
          </View>
        </View>

        <View style={[styles.descriptionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            BashVara হলো বাংলাদেশের সবচেয়ে সহজ ও নির্ভরযোগ্য ভাড়া বাসা খোঁজার প্ল্যাটফর্ম। আমরা বাড়িওয়ালা ও ভাড়াটিয়াদের সরাসরি সংযুক্ত করি, যাতে বাসা খোঁজা ও ভাড়া দেওয়া উভয়ই সহজ হয়।
          </Text>
        </View>

        <View style={[styles.featuresCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>প্রধান বৈশিষ্ট্য</Text>
          {[
            { icon: 'search-outline' as const, text: 'এলাকা, বাজেট ও রুম অনুযায়ী সার্চ' },
            { icon: 'chatbubbles-outline' as const, text: 'বাড়িওয়ালার সাথে সরাসরি মেসেজিং' },
            { icon: 'shield-checkmark-outline' as const, text: 'KYC ভেরিফাইড বাড়িওয়ালা' },
            { icon: 'heart-outline' as const, text: 'পছন্দের বাসা সংরক্ষণ' },
            { icon: 'map-outline' as const, text: 'মানচিত্রে অবস্থান দেখুন' },
            { icon: 'notifications-outline' as const, text: 'নতুন লিস্টিংয়ের আপডেট' },
          ].map((feature, index) => (
            <View key={index} style={[styles.featureRow, { borderBottomColor: colors.borderLight }]}>
              <Ionicons name={feature.icon} size={18} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature.text}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.devCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.devTitle, { color: colors.textPrimary }]}>ডেভেলপার</Text>
          <View style={styles.devRow}>
            <View style={[styles.devIcon, { backgroundColor: colors.primary + '12' }]}>
              <Ionicons name="code-slash-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.devInfo}>
              <Text style={[styles.devName, { color: colors.textPrimary }]}>BashVara Team</Text>
              <Text style={[styles.devDesc, { color: colors.textSecondary }]}>ঢাকা, বাংলাদেশ</Text>
            </View>
          </View>
        </View>

        <View style={[styles.socialCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.socialTitle, { color: colors.textPrimary }]}>আমাদের সাথে যুক্ত থাকুন</Text>
          <View style={styles.socialRow}>
            {[
              { icon: 'logo-facebook' as const, color: '#1877F2', url: 'https://facebook.com/bashvara' },
              { icon: 'logo-instagram' as const, color: '#E4405F', url: 'https://instagram.com/bashvara' },
              { icon: 'logo-twitter' as const, color: '#1DA1F2', url: 'https://twitter.com/bashvara' },
              { icon: 'logo-youtube' as const, color: '#FF0000', url: 'https://youtube.com/bashvara' },
            ].map((social, index) => (
              <Pressable
                key={index}
                style={[styles.socialBtn, { backgroundColor: social.color + '12' }]}
                onPress={() => Linking.openURL(social.url)}
              >
                <Ionicons name={social.icon} size={22} color={social.color} />
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.websiteBtn, { borderColor: colors.primary + '30', backgroundColor: colors.primaryLight }]}
          onPress={() => Linking.openURL('https://bashvara.com')}
        >
          <Ionicons name="globe-outline" size={18} color={colors.primary} />
          <Text style={[styles.websiteBtnText, { color: colors.primary }]}>bashvara.com</Text>
        </Pressable>

        <Text style={[styles.copyright, { color: colors.textMuted }]}>
          &copy; ২০২৬ BashVara। সর্বস্বত্ব সংরক্ষিত।
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  logoSection: { alignItems: 'center', paddingTop: 32, paddingBottom: 8 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    elevation: 8,
  },
  appName: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  appNameBn: { fontSize: 16, fontFamily: 'Inter_500Medium', marginTop: 2 },
  versionBadge: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, marginTop: 12,
  },
  versionText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  descriptionCard: {
    marginHorizontal: 20, marginTop: 24,
    borderRadius: 14, borderWidth: 1, padding: 18,
  },
  description: {
    fontSize: 14, fontFamily: 'Inter_400Regular',
    lineHeight: 24, textAlign: 'center',
  },
  featuresCard: {
    marginHorizontal: 20, marginTop: 14,
    borderRadius: 14, borderWidth: 1, padding: 18,
  },
  featuresTitle: {
    fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8,
    borderBottomWidth: 1,
  },
  featureText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  devCard: {
    marginHorizontal: 20, marginTop: 14,
    borderRadius: 14, borderWidth: 1, padding: 18,
  },
  devTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 14 },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  devIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  devInfo: { flex: 1 },
  devName: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  devDesc: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  socialCard: {
    marginHorizontal: 20, marginTop: 14,
    borderRadius: 14, borderWidth: 1, padding: 18,
  },
  socialTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 14 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  socialBtn: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  websiteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 20, marginTop: 18, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1,
  },
  websiteBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  copyright: {
    fontSize: 12, fontFamily: 'Inter_400Regular',
    textAlign: 'center', marginTop: 20,
  },
});
