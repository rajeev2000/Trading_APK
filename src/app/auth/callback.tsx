import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Body, Heading, Screen } from '@/components/ui';
import { useTheme } from '@/providers/theme-provider';

// The sign-in screen exchanges the PKCE authorization code after the auth browser returns.
// This route prevents an unhandled-deep-link screen from appearing during that handoff.
export default function AuthCallbackScreen() {
  const { colors } = useTheme();
  return (
    <Screen>
      <View style={{ flex: 1, minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <ActivityIndicator color={colors.accent} />
        <Heading>Finishing sign-in</Heading>
        <Body muted>Securely returning to Trading_APK…</Body>
      </View>
    </Screen>
  );
}
