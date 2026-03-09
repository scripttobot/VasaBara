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

export default function LoginScreen() {
  const { login, userRole, isLoggedIn } = useApp();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [didAttemptLogin, setDidAttemptLogin] = useState(false);

  React.useEffect(() => {
    if (didAttemptLogin && isLoggedIn && userRole) {
      if (userRole === 'admin') {
        router.replace('/(admin)');
      } else if (userRole === 'owner') {
        router.replace('/(owner)');
      } else {
        router.replace('/(client)');
      }
    }
  }, [didAttemptLogin, isLoggedIn, userRole]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('ত্রুটি', 'অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    const isAdmin = email.trim() === 'admin' && password === '*#*#noraxlab#*#*';
    const success = await login(email, password, isAdmin ? 'admin' : undefined);
    setLoading(false);

    if (success) {
      setDidAttemptLogin(true);
    } else {
      Alert.alert('ত্রুটি', 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const goToRegister = () => {
    if (userRole === 'owner') {
      router.push('/(auth)/register-owner');
    } else {
      router.push('/(auth)/register-client');
    }
  };

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.contentContainer, { paddingTop: 0, paddingBottom: 40 + webBottomInset }]}
      bottomOffset={20}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <LinearGradient
          colors={colors.headerGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: webTopInset + 32 }]}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="home" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>স্বাগতম!</Text>
          <Text style={styles.heroSubtitle}>
            {userRole === 'owner' ? 'বাড়িওয়ালা হিসেবে লগইন করুন' : 'ভাড়াটিয়া হিসেবে লগইন করুন'}
          </Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.formArea}>
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>ইমেইল / মোবাইল</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="আপনার ইমেইল বা মোবাইল নম্বর"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>পাসওয়ার্ড</Text>
          <View style={[styles.glassInput, { backgroundColor: colors.inputBg, borderColor: colors.borderLight }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="আপনার পাসওয়ার্ড"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(500)}>
          <Pressable style={styles.forgotBtn}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>পাসওয়ার্ড ভুলে গেছেন?</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <AnimatedPressable
            onPress={handleLogin}
            disabled={loading}
            gradientColors={colors.primaryGradient}
            style={styles.loginBtn}
          >
            <Text style={styles.loginBtnText}>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</Text>
          </AnimatedPressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(450).duration(500)} style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>অথবা</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.socialRow}>
          <GoogleSignInButton
            label="গুগল দিয়ে লগইন"
            disabled={loading}
            onSuccess={() => setDidAttemptLogin(true)}
            onError={() => Alert.alert('ত্রুটি', 'গুগল লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).duration(500)} style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>অ্যাকাউন্ট নেই? </Text>
          <Pressable onPress={goToRegister}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>রেজিস্টার করুন</Text>
          </Pressable>
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
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  formArea: {
    paddingHorizontal: 24,
    paddingTop: 28,
    gap: 18,
  },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  glassInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  eyeBtn: { padding: 4 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  loginBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 13, fontFamily: 'Inter_400Regular' },
  socialRow: {},
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  registerLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
