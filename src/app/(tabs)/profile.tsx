import React from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Eyebrow, Heading, Screen, SectionTitle, StatusLabel } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/providers/theme-provider';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isDemo, signOut } = useAuth();
  const { mode, toggleMode } = useTheme();

  const onSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      Alert.alert('Sign out', error instanceof Error ? error.message : 'Unable to sign out.');
    }
  };

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Eyebrow>SETTINGS</Eyebrow>
        <Heading>Profile</Heading>
        <Body muted>Account, appearance and future integrations.</Body>
      </View>

      <Card>
        <SectionTitle>Account</SectionTitle>
        <Body>{user?.email ?? (isDemo ? 'Demo user' : 'Not signed in')}</Body>
        <StatusLabel label={isDemo ? 'Demo mode' : user ? 'Google/Supabase session' : 'Preview only'} />
        {!user && !isDemo ? <AppButton title="Go to sign-in" onPress={() => router.replace('/sign-in')} /> : null}
        {isDemo ? <Body muted style={{ fontSize: 12 }}>Demo data stays local in the current app session and is not a cloud account.</Body> : null}
      </Card>

      <Card>
        <SectionTitle>Appearance</SectionTitle>
        <Body muted>Light mode uses off-white and black. Dark mode uses dark surfaces with orange text.</Body>
        <AppButton title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`} variant="secondary" onPress={toggleMode} />
      </Card>

      <Card>
        <SectionTitle>Connections</SectionTitle>
        <Body>Supabase: {isSupabaseConfigured ? 'Configured' : 'Not configured'}</Body>
        <Body>AI strategy provider: Not configured</Body>
        <Body>Market data: Not selected</Body>
        <Body>Push notifications: Not configured</Body>
      </Card>

      <Card>
        <SectionTitle>Safety</SectionTitle>
        <Body muted>Paper trading only. AI provider connection and usage permissions are separate from Google login. Monitoring is not currently active.</Body>
        <AppButton title="Sign out / exit demo" variant="quiet" onPress={onSignOut} />
      </Card>
    </Screen>
  );
}
