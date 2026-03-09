import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { setUserRole, isLoggedIn, userRole, authLoading } = useApp();

  React.useEffect(() => {
    if (authLoading) return;
    if (isLoggedIn && userRole) {
      if (userRole === 'admin') {
        router.replace('/(admin)');
      } else if (userRole === 'client') {
        router.replace('/(client)');
      } else {
        router.replace('/(owner)');
      }
    }
  }, [isLoggedIn, userRole, authLoading]);

  const handleRoleSelect = (role: 'client' | 'owner') => {
    setUserRole(role);
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F8F5', '#FFFFFF', '#FFF5EE']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40) }]}>
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="home" size={36} color={Colors.primary} />
            </View>
          </View>
          <Text style={styles.appTitle}>বাসভাড়া</Text>
          <Text style={styles.appSubtitle}>BashVara</Text>
          <Text style={styles.tagline}>আপনার স্বপ্নের বাসা খুঁজে নিন</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.roleSection}>
          <Text style={styles.sectionTitle}>আপনি কি করতে চান?</Text>

          <Pressable
            style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
            onPress={() => handleRoleSelect('client')}
          >
            <View style={[styles.roleIconContainer, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="search" size={28} color={Colors.primary} />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>বাড়ি খুঁজুন</Text>
              <Text style={styles.roleSubtitle}>ভাড়ার জন্য বাসা/ফ্ল্যাট/অফিস খুঁজুন</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colors.textMuted} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.roleCard, pressed && styles.roleCardPressed]}
            onPress={() => handleRoleSelect('owner')}
          >
            <View style={[styles.roleIconContainer, { backgroundColor: Colors.secondaryLight }]}>
              <Ionicons name="key" size={28} color={Colors.secondary} />
            </View>
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleTitle}>বাড়ি ভাড়া দিন</Text>
              <Text style={styles.roleSubtitle}>আপনার প্রপার্টি লিস্ট করুন</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colors.textMuted} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 20) }]}>
          <Text style={styles.footerText}>Made in Bangladesh</Text>
          <View style={styles.divider} />
          <Text style={styles.versionText}>v1.0.0</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  appTitle: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  roleSection: {
    paddingHorizontal: 24,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  roleCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  roleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextContainer: {
    flex: 1,
    gap: 2,
  },
  roleTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textPrimary,
  },
  roleSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  versionText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
  },
});
