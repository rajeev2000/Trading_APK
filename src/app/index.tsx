import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';

export default function IndexRoute() {
  const router = useRouter();
  const { user, isDemo, loading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (loading) return;
    router.replace(user || isDemo ? '/(tabs)' : '/sign-in');
  }, [user, isDemo, loading, router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}
