import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { DIVISIONS } from '@/constants/locations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const { user, userRole, updateUser } = useApp();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [division, setDivision] = useState(user?.division || '');
  const [nidNumber, setNidNumber] = useState(user?.nidNumber || '');
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { id: 'male', label: 'পুরুষ' },
    { id: 'female', label: 'মহিলা' },
    { id: 'other', label: 'অন্যান্য' },
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('ত্রুটি', 'নাম প্রয়োজন');
      return;
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    const updates: Record<string, string> = { name: name.trim(), phone: phone.trim(), whatsapp: whatsapp.trim() };
    if (userRole === 'client') {
      updates.gender = gender;
      updates.occupation = occupation;
      updates.division = division;
    } else if (userRole === 'owner') {
      updates.nidNumber = nidNumber;
    }

    const success = await updateUser(updates);
    setLoading(false);

    if (success) {
      Alert.alert('সফল', 'প্রোফাইল আপডেট হয়েছে');
      router.back();
    } else {
      Alert.alert('ত্রুটি', 'প্রোফাইল আপডেট করা যায়নি');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'web' ? 67 + insets.top : insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderLight, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>প্রোফাইল সম্পাদনা</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        bottomOffset={20}
      >
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>নাম *</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: colors.textPrimary }]} value={name} onChangeText={setName} placeholder="আপনার নাম" placeholderTextColor={colors.textMuted} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>মোবাইল নম্বর</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <Ionicons name="call-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: colors.textPrimary }]} value={phone} onChangeText={setPhone} placeholder="01XXXXXXXXX" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>হোয়াটসঅ্যাপ</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
              <Ionicons name="logo-whatsapp" size={20} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: colors.textPrimary }]} value={whatsapp} onChangeText={setWhatsapp} placeholder="01XXXXXXXXX" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
            </View>
          </View>

          {userRole === 'client' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>লিঙ্গ</Text>
                <View style={styles.chipRow}>
                  {genderOptions.map(opt => (
                    <Pressable key={opt.id} style={[styles.chip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, gender === opt.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]} onPress={() => setGender(opt.id)}>
                      <Text style={[styles.chipText, { color: colors.textSecondary }, gender === opt.id && { color: colors.primary }]}>{opt.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>পেশা</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                  <Ionicons name="briefcase-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={[styles.input, { color: colors.textPrimary }]} value={occupation} onChangeText={setOccupation} placeholder="আপনার পেশা" placeholderTextColor={colors.textMuted} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>বিভাগ</Text>
                <View style={styles.chipRow}>
                  {DIVISIONS.map(div => (
                    <Pressable key={div.id} style={[styles.chip, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }, division === div.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary }]} onPress={() => setDivision(div.id)}>
                      <Text style={[styles.chipText, { color: colors.textSecondary }, division === div.id && { color: colors.primary }]}>{div.nameBn}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          {userRole === 'owner' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>NID নম্বর</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
                <Ionicons name="id-card-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: colors.textPrimary }]} value={nidNumber} onChangeText={setNidNumber} placeholder="জাতীয় পরিচয়পত্র নম্বর" placeholderTextColor={colors.textMuted} keyboardType="number-pad" />
              </View>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary }, pressed && styles.saveBtnPressed, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>{loading ? 'সেভ হচ্ছে...' : 'সেভ করুন'}</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  email: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 50, borderWidth: 1 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  saveBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  saveBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
