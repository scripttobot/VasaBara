import React, { useCallback } from 'react';
import { Platform, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface AnimatedPressableProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  gradientColors?: [string, string] | string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  haptic?: boolean;
  scaleValue?: number;
  disabled?: boolean;
  children: React.ReactNode;
  testID?: string;
}

const SPRING_CONFIG = { damping: 15, stiffness: 400, mass: 0.8 };

export default function AnimatedPressable({
  onPress,
  style,
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  haptic = true,
  scaleValue = 0.96,
  disabled = false,
  children,
  testID,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleValue, SPRING_CONFIG);
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, []);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  }, [disabled, haptic, onPress]);

  const content = gradientColors ? (
    <LinearGradient
      colors={gradientColors as [string, string]}
      start={gradientStart}
      end={gradientEnd}
      style={[{ overflow: 'hidden' }, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    children
  );

  return (
    <Animated.View style={[animatedStyle, !gradientColors ? style : undefined, disabled && { opacity: 0.5 }]}>
      <Animated.View
        testID={testID}
        onTouchStart={handlePressIn}
        onTouchEnd={() => { handlePressOut(); handlePress(); }}
        onTouchCancel={handlePressOut}
      >
        {content}
      </Animated.View>
    </Animated.View>
  );
}
