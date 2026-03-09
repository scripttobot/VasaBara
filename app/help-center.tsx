import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

const faqItems = [
  {
    question: 'কিভাবে ভাড়া বাসা খুঁজব?',
    answer: 'হোম পেজে আপনি বিভিন্ন এলাকার বাসা দেখতে পাবেন। সার্চ বার ব্যবহার করে নির্দিষ্ট এলাকা, বাজেট, বা রুম সংখ্যা অনুযায়ী ফিল্টার করতে পারবেন। পছন্দের বাসা পেলে সেভ করে রাখতে পারবেন এবং বাড়িওয়ালার সাথে সরাসরি মেসেজে যোগাযোগ করতে পারবেন।',
  },
  {
    question: 'বাড়িওয়ালার সাথে কিভাবে যোগাযোগ করব?',
    answer: 'যেকোনো প্রপার্টি পেজে "মেসেজ করুন" বাটনে ক্লিক করুন। এটি আপনাকে সরাসরি বাড়িওয়ালার সাথে চ্যাটে নিয়ে যাবে। চ্যাটে আপনি বাসা সম্পর্কে বিস্তারিত জানতে পারবেন, ভিজিটের সময় ঠিক করতে পারবেন।',
  },
  {
    question: 'KYC ভেরিফিকেশন কি?',
    answer: 'KYC (Know Your Customer) হলো পরিচয় যাচাই প্রক্রিয়া। বাড়িওয়ালাদের জন্য KYC বাধ্যতামূলক। এটি সম্পন্ন করতে আপনার জাতীয় পরিচয়পত্র বা পাসপোর্টের ছবি আপলোড করতে হবে। আমাদের টিম যাচাই করে অনুমোদন দেবে। এটি ভাড়াটিয়াদের নিরাপত্তা নিশ্চিত করে।',
  },
  {
    question: 'কিভাবে আমার প্রপার্টি লিস্ট করব?',
    answer: 'বাড়িওয়ালা হিসেবে রেজিস্ট্রেশন করুন, তারপর "প্রপার্টি যোগ করুন" অপশনে যান। প্রপার্টির বিস্তারিত তথ্য (এলাকা, ভাড়া, রুম সংখ্যা, সুবিধাসমূহ) এবং ছবি যোগ করুন। KYC ভেরিফিকেশন সম্পন্ন থাকলে আপনার লিস্টিং প্রকাশিত হবে।',
  },
  {
    question: 'মেসেজ কত দিন সংরক্ষিত থাকে?',
    answer: 'চ্যাটের মেসেজগুলো ৭ দিন পর্যন্ত সংরক্ষিত থাকে। ৭ দিন পর পুরানো মেসেজ স্বয়ংক্রিয়ভাবে মুছে যায়। গুরুত্বপূর্ণ তথ্য (ফোন নম্বর, ঠিকানা ইত্যাদি) আলাদাভাবে সংরক্ষণ করে রাখুন।',
  },
  {
    question: 'অ্যাকাউন্ট ডিলিট করতে চাই?',
    answer: 'আপনার অ্যাকাউন্ট ডিলিট করতে support@bashvara.com এ ইমেইল করুন অথবা সেটিংস থেকে "অ্যাকাউন্ট ডিলিট" অপশন ব্যবহার করুন। অ্যাকাউন্ট ডিলিট করলে আপনার সমস্ত ডাটা ৩০ দিনের মধ্যে মুছে ফেলা হবে।',
  },
  {
    question: 'ভুয়া লিস্টিং দেখলে কি করব?',
    answer: 'ভুয়া বা সন্দেহজনক লিস্টিং দেখলে প্রপার্টি পেজে "রিপোর্ট" বাটনে ক্লিক করুন অথবা support@bashvara.com এ জানান। আমাদের টিম দ্রুত তদন্ত করে ব্যবস্থা নেবে।',
  },
];

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>সাহায্য কেন্দ্র</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-buoy" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.introTitle}>আমরা সাহায্য করতে এখানে</Text>
          <Text style={styles.introText}>
            সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর নিচে পাবেন। আরো সাহায্য দরকার হলে আমাদের সাথে যোগাযোগ করুন।
          </Text>
        </View>

        <Text style={styles.faqTitle}>সচরাচর জিজ্ঞাসিত প্রশ্ন</Text>

        {faqItems.map((item, index) => (
          <Pressable
            key={index}
            style={styles.faqItem}
            onPress={() => toggleExpand(index)}
          >
            <View style={styles.faqHeader}>
              <View style={styles.questionRow}>
                <View style={[styles.questionIcon, { backgroundColor: Colors.primary + '12' }]}>
                  <Text style={styles.questionNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.question}>{item.question}</Text>
              </View>
              <Ionicons
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={Colors.textMuted}
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </Pressable>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactSectionTitle}>যোগাযোগ</Text>

          <Pressable
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:support@bashvara.com')}
          >
            <View style={[styles.contactIcon, { backgroundColor: Colors.primary + '12' }]}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>ইমেইল</Text>
              <Text style={styles.contactValue}>support@bashvara.com</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={Colors.textMuted} />
          </Pressable>

          <Pressable
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:+8801700000000')}
          >
            <View style={[styles.contactIcon, { backgroundColor: Colors.success + '12' }]}>
              <Ionicons name="call-outline" size={20} color={Colors.success} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>ফোন</Text>
              <Text style={styles.contactValue}>+880 1700-000000</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.hoursBox}>
            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.hoursText}>সাপোর্ট আওয়ার: সকাল ৯টা - রাত ৯টা (শনি-বৃহস্পতি)</Text>
          </View>
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
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  introTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 8 },
  introText: {
    fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22,
  },
  faqTitle: {
    fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary,
    marginHorizontal: 20, marginTop: 20, marginBottom: 10,
  },
  faqItem: {
    backgroundColor: '#FFFFFF', marginHorizontal: 20, marginBottom: 10,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 16,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  questionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 8 },
  questionIcon: {
    width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  questionNumber: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.primary },
  question: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, flex: 1 },
  answer: {
    fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary,
    lineHeight: 22, marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  contactSection: {
    marginHorizontal: 20, marginTop: 24,
  },
  contactSectionTitle: {
    fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    padding: 16, marginBottom: 10, gap: 12,
  },
  contactIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textMuted },
  contactValue: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  hoursBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.inputBg, borderRadius: 10, padding: 12, marginTop: 4,
  },
  hoursText: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
});
