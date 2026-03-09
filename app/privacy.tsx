import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/lib/theme-context';

const sections = [
  {
    title: 'তথ্য সংগ্রহ',
    icon: 'folder-open-outline' as const,
    content:
      'আমরা আপনার নাম, ইমেইল, ফোন নম্বর, এবং অবস্থান তথ্য সংগ্রহ করি যা আপনি নিবন্ধনের সময় প্রদান করেন। বাড়িওয়ালাদের ক্ষেত্রে KYC যাচাইয়ের জন্য জাতীয় পরিচয়পত্র বা পাসপোর্টের তথ্য সংগ্রহ করা হতে পারে। এছাড়াও, অ্যাপ ব্যবহারের সময় ডিভাইস তথ্য এবং ব্যবহার পরিসংখ্যান স্বয়ংক্রিয়ভাবে সংগ্রহ হতে পারে।',
  },
  {
    title: 'তথ্য ব্যবহার',
    icon: 'analytics-outline' as const,
    content:
      'সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহৃত হয়:\n\n• আপনার অ্যাকাউন্ট পরিচালনা ও যাচাই করা\n• ভাড়া বাসা খোঁজার সেবা প্রদান করা\n• বাড়িওয়ালা ও ভাড়াটিয়াদের মধ্যে যোগাযোগ সহজতর করা\n• অ্যাপের অভিজ্ঞতা উন্নত করা\n• নিরাপত্তা নিশ্চিত করা ও জালিয়াতি প্রতিরোধ করা',
  },
  {
    title: 'তথ্য সুরক্ষা',
    icon: 'lock-closed-outline' as const,
    content:
      'আমরা আপনার তথ্য সুরক্ষায় শিল্প-মানের নিরাপত্তা ব্যবস্থা ব্যবহার করি:\n\n• Firebase Authentication দ্বারা নিরাপদ লগইন\n• Firestore ডাটাবেজে এনক্রিপ্টেড ডাটা সংরক্ষণ\n• SSL/TLS এনক্রিপশন দ্বারা ডাটা ট্রান্সমিশন\n• নিয়মিত নিরাপত্তা অডিট ও আপডেট',
  },
  {
    title: 'তৃতীয় পক্ষ',
    icon: 'people-outline' as const,
    content:
      'আমরা নিম্নলিখিত তৃতীয় পক্ষ সেবা ব্যবহার করি:\n\n• Google Firebase - অথেন্টিকেশন ও ডাটা সংরক্ষণ\n• Google Maps - মানচিত্র ও অবস্থান সেবা\n• Expo - অ্যাপ ডেভেলপমেন্ট প্ল্যাটফর্ম\n\nআমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না। শুধুমাত্র সেবা প্রদানের জন্য প্রয়োজনীয় তথ্য শেয়ার করা হয়।',
  },
  {
    title: 'ডাটা মুছে ফেলার অনুরোধ',
    icon: 'trash-outline' as const,
    content:
      'আপনি যেকোনো সময় আপনার ডাটা মুছে ফেলার অনুরোধ করতে পারেন:\n\n• অ্যাপ থেকে আপনার অ্যাকাউন্ট ডিলিট করুন\n• support@bashvara.com এ ইমেইল করুন\n• আমরা ৩০ দিনের মধ্যে আপনার সমস্ত ডাটা মুছে ফেলব\n\nদ্রষ্টব্য: আইনি বাধ্যবাধকতার কারণে কিছু তথ্য নির্দিষ্ট সময়ের জন্য সংরক্ষণ করা হতে পারে।',
  },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>গোপনীয়তা নীতি</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। নিচে আমাদের গোপনীয়তা নীতির বিস্তারিত দেওয়া হলো।
          </Text>
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>সর্বশেষ আপডেট: মার্চ ২০২৬</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '12' }]}>
                <Ionicons name={section.icon} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.title}</Text>
            </View>
            <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{section.content}</Text>
          </View>
        ))}

        <View style={[styles.contactBox, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.contactTitle, { color: colors.primary }]}>প্রশ্ন আছে?</Text>
          <Text style={[styles.contactText, { color: colors.primaryDark }]}>privacy@bashvara.com এ যোগাযোগ করুন</Text>
        </View>
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
  intro: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 8 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  introText: {
    fontSize: 14, fontFamily: 'Inter_400Regular',
    textAlign: 'center', lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 8,
  },
  section: {
    marginHorizontal: 20, marginTop: 14,
    borderRadius: 14, borderWidth: 1, padding: 18,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  sectionContent: {
    fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22,
  },
  contactBox: {
    marginHorizontal: 20, marginTop: 20,
    borderRadius: 14, padding: 18, alignItems: 'center',
  },
  contactTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  contactText: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
