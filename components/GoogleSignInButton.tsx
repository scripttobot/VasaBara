import React, { useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/lib/firebase';
import Colors from '@/constants/colors';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  label: string;
  disabled?: boolean;
  onSuccess: () => void;
  onError: () => void;
}

export function GoogleSignInButton({ label, disabled, onSuccess, onError }: Props) {
  const [signingIn, setSigningIn] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = response.authentication?.idToken ?? null;
      const accessToken = response.authentication?.accessToken ?? null;

      if (idToken || accessToken) {
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        signInWithCredential(auth, credential)
          .then(() => {
            setSigningIn(false);
            onSuccess();
          })
          .catch((err) => {
            console.error('Firebase credential error:', err);
            setSigningIn(false);
            onError();
          });
      } else {
        setSigningIn(false);
        onError();
      }
    } else if (response.type === 'error') {
      console.error('Google auth error:', response.error);
      setSigningIn(false);
      onError();
    } else if (response.type === 'dismiss' || response.type === 'cancel') {
      setSigningIn(false);
    }
  }, [response]);

  const handlePress = async () => {
    setSigningIn(true);
    if (Platform.OS === 'web') {
      try {
        const { signInWithPopup } = await import('firebase/auth');
        const { googleProvider } = await import('@/lib/firebase');
        await signInWithPopup(auth, googleProvider);
        setSigningIn(false);
        onSuccess();
      } catch (err: any) {
        if (err?.code !== 'auth/popup-closed-by-user') {
          console.error('Web Google sign-in error:', err);
          onError();
        }
        setSigningIn(false);
      }
    } else {
      await promptAsync();
    }
  };

  const isLoading = signingIn;
  const isDisabled = disabled || isLoading || (!request && Platform.OS !== 'web');

  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, isDisabled && styles.btnDisabled]}
      onPress={handlePress}
      disabled={isDisabled}
      testID="google-sign-in-btn"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#DB4437" />
      ) : (
        <Ionicons name="logo-google" size={20} color="#DB4437" />
      )}
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    height: 52,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  btnDisabled: { opacity: 0.5 },
  text: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
});
