import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/lib/app-context';
import { useColors, useTheme } from '@/lib/theme-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { setUserRole, isLoggedIn, userRole, authLoading } = useApp();
  const colors = useColors();
  const { isDark } = useTheme();

  const glowPulse = useSharedValue(0);
  const bgShift = useSharedValue(0);

  useEffect(() => {
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    bgShift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
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

  const glowStyle = useAnimatedStyle(() => {
    const glowScale = interpolate(glowPulse.value, [0, 1], [1, 1.15]);
    const glowOpacity = interpolate(glowPulse.value, [0, 1], [0.4, 0.85]);
    return {
      transform: [{ scale: glowScale }],
      opacity: glowOpacity,
    };
  });

  const bgOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(bgShift.value, [0, 1], [0, 0.12]);
    return { opacity };
  });

  const topPadding = insets.top + (Platform.OS === 'web' ? 67 : 20);
  const bottomPadding = insets.bottom + (Platform.OS === 'web' ? 34 : 20);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <LinearGradient
        colors={colors.backgroundGradient as [string, string, string]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          bgOverlayStyle,
        ]}
      >
        <LinearGradient
          colors={isDark
            ? ['transparent', colors.primary + '15', 'transparent']
            : ['transparent', colors.primary + '08', 'transparent']
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      <View style={[styles.content, { paddingTop: topPadding }]}>
        <Animated.View entering={FadeInUp.delay(200).duration(700).springify()} style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            <Animated.View
              style={[
                styles.glowCircle,
                { backgroundColor: colors.primary },
                glowStyle,
              ]}
            />
            <View style={[styles.logoCircle, {
              backgroundColor: isDark ? colors.card : colors.surface,
              borderColor: colors.primary,
            }]}>
              <LinearGradient
                colors={colors.primaryGradient}
                style={styles.logoInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="home" size={34} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>
          <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
            বাসভাড়া
          </Text>
          <Text style={[styles.appSubtitle, { color: colors.primary }]}>
            BashVara
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            আপনার স্বপ্নের বাসা খুঁজে নিন
          </Text>
        </Animated.View>

        <View style={styles.roleSection}>
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              আপনি কি করতে চান?
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(550).duration(600)}>
            <AnimatedPressable
              onPress={() => handleRoleSelect('client')}
              style={[styles.roleCard, {
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
            >
              <LinearGradient
                colors={colors.primaryGradient}
                style={styles.roleIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="search" size={26} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, { color: colors.textPrimary }]}>
                  বাড়ি খুঁজুন
                </Text>
                <Text style={[styles.roleSubtitle, { color: colors.textSecondary }]}>
                  ভাড়ার জন্য বাসা/ফ্ল্যাট/অফিস খুঁজুন
                </Text>
              </View>
              <View style={[styles.arrowCircle, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </View>
            </AnimatedPressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(600)}>
            <AnimatedPressable
              onPress={() => handleRoleSelect('owner')}
              style={[styles.roleCard, {
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
            >
              <LinearGradient
                colors={colors.secondaryGradient}
                style={styles.roleIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="key" size={26} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, { color: colors.textPrimary }]}>
                  বাড়ি ভাড়া দিন
                </Text>
                <Text style={[styles.roleSubtitle, { color: colors.textSecondary }]}>
                  আপনার প্রপার্টি লিস্ট করুন
                </Text>
              </View>
              <View style={[styles.arrowCircle, { backgroundColor: colors.secondary + '15' }]}>
                <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
              </View>
            </AnimatedPressable>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(900).duration(600)}
          style={[styles.footer, { paddingBottom: bottomPadding }]}
        >
          <View style={[styles.footerDividerLine, { backgroundColor: colors.border }]} />
          <View style={styles.footerContent}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Made in Bangladesh
            </Text>
            <View style={[styles.footerDot, { backgroundColor: colors.textMuted }]} />
            <Text style={[styles.versionText, { color: colors.textMuted }]}>
              v1.0.0
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 50,
  },
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  logoInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  roleSection: {
    paddingHorizontal: 24,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1,
  },
  roleIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextContainer: {
    flex: 1,
    gap: 3,
  },
  roleTitle: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  roleSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  footerDividerLine: {
    width: 40,
    height: 1,
    borderRadius: 1,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  versionText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
