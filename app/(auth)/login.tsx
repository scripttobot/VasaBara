import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const { login, userRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('ত্রুটি', 'অনুগ্রহ করে সব তথ্য পূরণ করুন');
      return;
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.dismissAll();
      if (userRole === 'owner') {
        router.replace('/(owner)');
      } else {
        router.replace('/(client)');
      }
    }
  };

  const goToRegister = () => {
    if (userRole === 'owner') {
      router.push('/(auth)/register-owner');
    } else {
      router.push('/(auth)/register-client');
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bottomOffset={20}
    >
      <View style={styles.header}>
        <Text style={styles.title}>স্বাগতম!</Text>
        <Text style={styles.subtitle}>
          {userRole === 'owner' ? 'বাড়িওয়ালা হিসেবে লগইন করুন' : 'ভাড়াটিয়া হিসেবে লগইন করুন'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ইমেইল / মোবাইল</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="আপনার ইমেইল বা মোবাইল নম্বর"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>পাসওয়ার্ড</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="আপনার পাসওয়ার্ড"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textMuted} />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.forgotBtn}>
          <Text style={styles.forgotText}>পাসওয়ার্ড ভুলে গেছেন?</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</Text>
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>অথবা</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <Pressable style={styles.socialBtn}>
          <Ionicons name="logo-google" size={22} color="#DB4437" />
        </Pressable>
        <Pressable style={styles.socialBtn}>
          <Ionicons name="logo-facebook" size={22} color="#4267B2" />
        </Pressable>
      </View>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>অ্যাকাউন্ট নেই? </Text>
        <Pressable onPress={goToRegister}>
          <Text style={styles.registerLink}>রেজিস্টার করুন</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  form: { gap: 18 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  eyeBtn: { padding: 4 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.primary },
  loginBtn: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 16, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 28 },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  registerLink: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
});
