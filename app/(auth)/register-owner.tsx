import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function RegisterOwnerScreen() {
  const { register, googleLogin } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('ত্রুটি', 'অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন');
      return;
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    const success = await register({ name, email, phone, whatsapp, nidNumber }, 'owner', password);
    setLoading(false);
    if (success) {
      router.replace('/(owner)');
    } else {
      Alert.alert('ত্রুটি', 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। ইমেইল আগে ব্যবহার হয়ে থাকতে পারে বা পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।');
    }
  };

  const handleGoogleRegister = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    const success = await googleLogin('owner');
    setLoading(false);
    if (success) {
      router.replace('/(owner)');
    } else {
      Alert.alert('ত্রুটি', 'গুগল সাইন আপ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bottomOffset={20}
    >
      <View style={styles.header}>
        <Text style={styles.title}>বাড়িওয়ালা রেজিস্ট্রেশন</Text>
        <Text style={styles.subtitle}>আপনার প্রপার্টি লিস্ট করতে রেজিস্টার করুন</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>নাম *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="আপনার পূর্ণ নাম" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ইমেইল *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="example@mail.com" placeholderTextColor={Colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>মোবাইল নম্বর *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="01XXXXXXXXX" placeholderTextColor={Colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>NID নম্বর</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="id-card-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="জাতীয় পরিচয়পত্র নম্বর" placeholderTextColor={Colors.textMuted} value={nidNumber} onChangeText={setNidNumber} keyboardType="number-pad" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>পাসওয়ার্ড *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="কমপক্ষে ৬ অক্ষর" placeholderTextColor={Colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>হোয়াটসঅ্যাপ নম্বর</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="logo-whatsapp" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="01XXXXXXXXX (ঐচ্ছিক)" placeholderTextColor={Colors.textMuted} value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ঠিকানা</Text>
          <View style={[styles.inputWrapper, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name="location-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { textAlignVertical: 'top' }]}
              placeholder="আপনার বর্তমান ঠিকানা"
              placeholderTextColor={Colors.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.kycNote}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.kycNoteText}>
            রেজিস্ট্রেশনের পর KYC ভেরিফিকেশনের জন্য NID এর ছবি আপলোড করতে হবে
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed, loading && styles.registerBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerBtnText}>{loading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}</Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>অথবা</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleBtn} onPress={handleGoogleRegister} disabled={loading}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleBtnText}>গুগল দিয়ে সাইন আপ</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentContainer: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
    borderRadius: 12, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: Colors.borderLight,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  kycNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primaryLight,
    padding: 14, borderRadius: 12,
  },
  kycNoteText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.primaryDark, lineHeight: 18 },
  registerBtn: {
    backgroundColor: Colors.primary, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  registerBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  googleBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    height: 52,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  googleBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
});
