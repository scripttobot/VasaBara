import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const sections = [
  {
    title: 'ব্যবহারের শর্তাবলী',
    icon: 'document-text-outline' as const,
    content:
      'BashVara অ্যাপ ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলী মেনে নিচ্ছেন:\n\n• আপনি সঠিক ও সত্য তথ্য প্রদান করবেন\n• আপনি অন্যের অ্যাকাউন্ট ব্যবহার করবেন না\n• আপনি অবৈধ বা ক্ষতিকর কোনো কাজে অ্যাপ ব্যবহার করবেন না\n• আপনি অন্য ব্যবহারকারীদের সাথে সম্মানজনক আচরণ করবেন\n• আপনি স্প্যাম বা ভুয়া তথ্য পোস্ট করবেন না',
  },
  {
    title: 'দায়বদ্ধতা',
    icon: 'alert-circle-outline' as const,
    content:
      'BashVara একটি প্ল্যাটফর্ম যা বাড়িওয়ালা ও ভাড়াটিয়াদের সংযুক্ত করে। আমরা নিম্নলিখিত বিষয়ে দায়বদ্ধ নই:\n\n• বাড়িওয়ালা কর্তৃক প্রদত্ত তথ্যের সঠিকতা\n• ভাড়াটিয়া ও বাড়িওয়ালার মধ্যে চুক্তি বা লেনদেন\n• প্রপার্টির প্রকৃত অবস্থা\n• ব্যবহারকারীদের মধ্যে কোনো বিরোধ\n• প্রাকৃতিক দুর্যোগ বা অপ্রত্যাশিত ঘটনার কারণে সেবা বিঘ্ন\n\nতবে আমরা সর্বদা ন্যায্যতা নিশ্চিত করতে এবং সমস্যা সমাধানে সহায়তা করতে প্রতিশ্রুতিবদ্ধ।',
  },
  {
    title: 'অ্যাকাউন্ট',
    icon: 'person-circle-outline' as const,
    content:
      'আপনার অ্যাকাউন্ট সম্পর্কিত নিয়মাবলী:\n\n• প্রতিটি ব্যক্তি একটি মাত্র অ্যাকাউন্ট রাখতে পারবেন\n• আপনার অ্যাকাউন্টের নিরাপত্তা আপনার দায়িত্ব\n• আপনার পাসওয়ার্ড কারো সাথে শেয়ার করবেন না\n• সন্দেহজনক কার্যকলাপ দেখলে অবিলম্বে জানান\n• আমরা যেকোনো সময় নিয়ম লঙ্ঘনকারী অ্যাকাউন্ট স্থগিত বা বন্ধ করতে পারি\n• বাড়িওয়ালা অ্যাকাউন্টের জন্য KYC যাচাই বাধ্যতামূলক',
  },
  {
    title: 'পেমেন্ট',
    icon: 'card-outline' as const,
    content:
      'পেমেন্ট সংক্রান্ত নীতিমালা:\n\n• BashVara বর্তমানে প্রপার্টি লিস্টিং বিনামূল্যে প্রদান করে\n• ভবিষ্যতে প্রিমিয়াম ফিচার যোগ হতে পারে\n• যেকোনো অর্থ লেনদেন বাড়িওয়ালা ও ভাড়াটিয়ার মধ্যে সরাসরি সম্পন্ন হবে\n• BashVara কোনো ভাড়ার অর্থ সংগ্রহ বা মধ্যস্থতা করে না\n• পেমেন্ট সংক্রান্ত কোনো পরিবর্তন হলে পূর্বে জানানো হবে',
  },
  {
    title: 'বিরোধ নিষ্পত্তি',
    icon: 'git-compare-outline' as const,
    content:
      'বিরোধ দেখা দিলে নিম্নলিখিত পদক্ষেপ অনুসরণ করুন:\n\n১. প্রথমে সংশ্লিষ্ট পক্ষের সাথে সরাসরি আলোচনা করুন\n২. সমাধান না হলে support@bashvara.com এ বিস্তারিত জানান\n৩. আমাদের সাপোর্ট টিম ৪৮ ঘণ্টার মধ্যে সমস্যা পর্যালোচনা করবে\n৪. প্রয়োজনে উভয় পক্ষের বক্তব্য শুনে সিদ্ধান্ত নেওয়া হবে\n৫. চূড়ান্ত সিদ্ধান্তে অসন্তুষ্ট হলে আইনি পদক্ষেপ নেওয়ার অধিকার সংরক্ষিত\n\nসকল বিরোধ বাংলাদেশের আইন অনুযায়ী নিষ্পত্তি হবে।',
  },
];

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>শর্তাবলী</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text" size={32} color={Colors.textSecondary} />
          </View>
          <Text style={styles.introText}>
            BashVara ব্যবহার করার আগে অনুগ্রহ করে নিম্নলিখিত শর্তাবলী মনোযোগ দিয়ে পড়ুন।
          </Text>
          <Text style={styles.lastUpdated}>সর্বশেষ আপডেট: মার্চ ২০২৬</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.acceptBox}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.acceptText}>
            অ্যাপ ব্যবহার অব্যাহত রাখলে আপনি উপরের শর্তাবলী মেনে নিচ্ছেন বলে গণ্য হবে।
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 14, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  intro: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 8 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.inputBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  introText: {
    fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textMuted, marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 14,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 18,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  numberBadge: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  numberText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  sectionTitleRow: { flex: 1 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  sectionContent: {
    fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 22,
  },
  acceptBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.successLight, marginHorizontal: 20, marginTop: 20,
    borderRadius: 14, padding: 16,
  },
  acceptText: {
    fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.success, flex: 1, lineHeight: 20,
  },
});
