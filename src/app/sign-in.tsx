import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Eyebrow, Heading, Screen } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/providers/theme-provider';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithGoogle, enterDemo } = useAuth();
  const { colors } = useTheme();
  const [busy, setBusy] = useState(false);

  const onGoogleSignIn = async () => {
    setBusy(true);
    try {
      await signInWithGoogle();
      router.replace('/');
    } catch (error) {
      Alert.alert('Google sign-in', error instanceof Error ? error.message : 'Unable to start sign-in.');
    } finally {
      setBusy(false);
    }
  };

  const onDemo = () => {
    enterDemo();
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <View style={{ minHeight: 140, justifyContent: 'center', gap: 12, paddingTop: 30 }}>
        <Eyebrow>TRADING_APK / PAPER MODE</Eyebrow>
        <Heading>Trade the idea. Not the money.</Heading>
        <Body muted>Practice a strategy with virtual cash and review each signal before taking action.</Body>
      </View>

      <Card style={{ paddingVertical: 24 }}>
        <View style={{ gap: 8 }}>
          <Heading>Get started</Heading>
          <Body muted>Sign in to save your account across devices, or explore the current interface in demo mode.</Body>
        </View>
        <AppButton title="Continue with Google" loading={busy} onPress={onGoogleSignIn} />
        {!isSupabaseConfigured ? <Body muted>Google login becomes available after Supabase and Google OAuth are configured.</Body> : null}
        <AppButton title="Explore demo" variant="secondary" onPress={onDemo} />
      </Card>

      <View style={{ gap: 8, paddingTop: 4 }}>
        <Body muted>Paper trading only. No real money or broker connection is used.</Body>
        <Body muted style={{ fontSize: 12 }}>AI-assisted strategy parsing and scheduled monitoring are not enabled in this starter build.</Body>
      </View>
      <View style={{ height: 32, borderTopWidth: 1, borderTopColor: colors.border, justifyContent: 'center', marginTop: 24 }}>
        <Body muted style={{ fontSize: 12 }}>Private by design · Virtual balance · Evidence-first alerts</Body>
      </View>
    </Screen>
  );
}
