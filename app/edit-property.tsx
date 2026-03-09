import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function EditPropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPropertyById, updateProperty, user } = useApp();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const property = getPropertyById(id!);
  const isOwner = property && user && property.ownerId === user.id;

  const [title, setTitle] = useState(property?.title || '');
  const [description, setDescription] = useState(property?.description || '');
  const [address, setAddress] = useState(property?.address || '');
  const [rent, setRent] = useState(property?.rent?.toString() || '');
  const [deposit, setDeposit] = useState(property?.deposit?.toString() || '');
  const [serviceCharge, setServiceCharge] = useState(property?.serviceCharge?.toString() || '');
  const [bedrooms, setBedrooms] = useState(property?.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState(property?.bathrooms?.toString() || '');
  const [area, setArea] = useState(property?.area?.toString() || '');
  const [loading, setLoading] = useState(false);

  if (!property || !isOwner) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 67 : insets.top }]}>
        <Text style={[styles.errorText, { color: colors.textMuted }]}>{!property ? 'প্রপার্টি পাওয়া যায়নি' : 'আপনার এই প্রপার্টি সম্পাদনা করার অনুমতি নেই'}</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={[styles.backLinkText, { color: colors.primary }]}>ফিরে যান</Text>
        </Pressable>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || !address.trim() || !rent.trim()) {
      Alert.alert('ত্রুটি', 'শিরোনাম, ঠিকানা এবং ভাড়া প্রয়োজন');
      return;
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    const success = await updateProperty(id!, {
      title: title.trim(),
      description: description.trim(),
      address: address.trim(),
      rent: parseInt(rent) || 0,
      deposit: parseInt(deposit) || 0,
      serviceCharge: parseInt(serviceCharge) || 0,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      area: parseInt(area) || 0,
    });
    setLoading(false);

    if (success) {
      Alert.alert('সফল', 'প্রপার্টি আপডেট হয়েছে');
      router.back();
    } else {
      Alert.alert('ত্রুটি', 'প্রপার্টি আপডেট করা যায়নি');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 67 + insets.top : insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderLight, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>প্রপার্টি সম্পাদনা</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>শিরোনাম *</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={title} onChangeText={setTitle} placeholder="প্রপার্টির শিরোনাম" placeholderTextColor={colors.textMuted} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>বিবরণ</Text>
            <TextInput style={[styles.input, styles.textArea, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={description} onChangeText={setDescription} placeholder="বিস্তারিত বিবরণ" placeholderTextColor={colors.textMuted} multiline numberOfLines={4} textAlignVertical="top" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>ঠিকানা *</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={address} onChangeText={setAddress} placeholder="পূর্ণ ঠিকানা" placeholderTextColor={colors.textMuted} />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>ভাড়া (৳) *</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={rent} onChangeText={setRent} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>জামানত (৳)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={deposit} onChangeText={setDeposit} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>সার্ভিস চার্জ</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={serviceCharge} onChangeText={setServiceCharge} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>আয়তন (sq ft)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={area} onChangeText={setArea} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>বেডরুম</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={bedrooms} onChangeText={setBedrooms} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>বাথরুম</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.borderLight }]} value={bathrooms} onChangeText={setBathrooms} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary }, pressed && styles.saveBtnPressed, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>{loading ? 'সেভ হচ্ছে...' : 'আপডেট করুন'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, fontFamily: 'Inter_500Medium' },
  backLink: { marginTop: 16 },
  backLinkText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  input: { borderRadius: 12, paddingHorizontal: 14, height: 50, fontSize: 15, fontFamily: 'Inter_400Regular', borderWidth: 1 },
  textArea: { height: 100, paddingTop: 14, textAlignVertical: 'top' as const },
  row: { flexDirection: 'row', gap: 12 },
  saveBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  saveBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
