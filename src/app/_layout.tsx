import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { AppDataProvider } from '@/providers/app-data-provider';

function NavigationRoot() {
  const { colors, mode } = useTheme();
  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="new-session" options={{ presentation: 'modal' }} />
        <Stack.Screen name="new-strategy" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <NavigationRoot />
          </AppDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
