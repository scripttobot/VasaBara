import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import AnimatedPressable from '@/components/AnimatedPressable';
import * as Haptics from 'expo-haptics';

export default function RegisterOwnerScreen() {
  const { register, isLoggedIn, userRole } = useApp();
  const colors = useColors();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [didAttempt, setDidAttempt] = useState(false);

  React.useEffect(() => {
    if (didAttempt && isLoggedIn && userRole) {
      if (userRole === 'owner') {
        router.replace('/(owner)');
      } else {
        router.replace('/(client)');
      }
    }
  }, [didAttempt, isLoggedIn, userRole]);

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
      setDidAttempt(true);
    } else {
      Alert.alert('ত্রুটি', 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। ইমেইল আগে ব্যবহার হয়ে থাকতে পারে বা পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।');
    }
  };

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: 40 + webBottomInset }]}
      bottomOffset={20}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <LinearGradient
          colors={colors.headerGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: webTopInset + 24 }]}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="business" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>বাড়িওয়ালা রেজিস্ট্রেশন</Text>
          <Text style={styles.heroSubtitle}>আপনার প্রপার্টি লিস্ট করতে রেজিস্টার করুন</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.formArea}>
        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>নাম *</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="আপনার পূর্ণ নাম" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>ইমেইল *</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="example@mail.com" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>মোবাইল নম্বর *</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="call-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="01XXXXXXXXX" placeholderTextColor={colors.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>NID নম্বর</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="id-card-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="জাতীয় পরিচয়পত্র নম্বর" placeholderTextColor={colors.textMuted} value={nidNumber} onChangeText={setNidNumber} keyboardType="number-pad" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>পাসওয়ার্ড *</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="কমপক্ষে ৬ অক্ষর" placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>হোয়াটসঅ্যাপ নম্বর</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="logo-whatsapp" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput style={[styles.input, { color: colors.textPrimary }]} placeholder="01XXXXXXXXX (ঐচ্ছিক)" placeholderTextColor={colors.textMuted} value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>ঠিকানা</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight, height: 80, alignItems: 'flex-start' as const, paddingTop: 12 }]}>
            <Ionicons name="location-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary, textAlignVertical: 'top' }]}
              placeholder="আপনার বর্তমান ঠিকানা"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <View style={[styles.kycNote, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.kycNoteText, { color: colors.primary }]}>
              রেজিস্ট্রেশনের পর KYC ভেরিফিকেশনের জন্য NID এর ছবি আপলোড করতে হবে
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).duration(500)}>
          <AnimatedPressable
            onPress={handleRegister}
            disabled={loading}
            gradientColors={colors.primaryGradient}
            style={styles.registerBtn}
          >
            <Text style={styles.registerBtnText}>{loading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}</Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)}>
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted }]}>অথবা</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(650).duration(500)}>
          <GoogleSignInButton
            label="গুগল দিয়ে সাইন আপ"
            disabled={loading}
            onSuccess={() => setDidAttempt(true)}
            onError={() => Alert.alert('ত্রুটি', 'গুগল সাইন আপ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')}
          />
        </Animated.View>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 40 },
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  formArea: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  glassInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  kycNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  kycNoteText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  registerBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  registerBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 13, fontFamily: 'Inter_400Regular' },
});
