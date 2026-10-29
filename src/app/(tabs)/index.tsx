import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Eyebrow, Heading, Screen, SectionTitle, StatusLabel } from '@/components/ui';
import { formatMoney } from '@/lib/format';
import { useAppData } from '@/providers/app-data-provider';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';

export default function HomeScreen() {
  const router = useRouter();
  const { paperSession, strategies, loadingData } = useAppData();
  const { user, isDemo } = useAuth();
  const { colors } = useTheme();
  const activeCount = strategies.filter((item) => item.status === 'active').length;

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Eyebrow>YOUR WORKSPACE</Eyebrow>
        <Heading>Good decisions start with evidence.</Heading>
        <Body muted>Paper trade ideas. Review the rules. Keep risk in view.</Body>
      </View>

      <Card style={{ backgroundColor: colors.surface, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <Eyebrow>VIRTUAL CASH</Eyebrow>
          <StatusLabel label={isDemo ? 'Demo mode' : user ? 'Account connected' : 'Local preview'} />
        </View>
        {paperSession ? (
          <>
            <Heading>{formatMoney(paperSession.cashBalanceMinor, paperSession.currency)}</Heading>
            <Body muted>Starting capital: {formatMoney(paperSession.startingCashMinor, paperSession.currency)}</Body>
            <Body muted style={{ fontSize: 12 }}>No real money is connected. Portfolio figures are simulated.</Body>
          </>
        ) : (
          <>
            <Heading>Set your starting balance</Heading>
            <Body muted>Create a paper session using a virtual amount. No deposit is required.</Body>
            <AppButton title="Create paper session" onPress={() => router.push('/new-session')} />
          </>
        )}
      </Card>

      <View style={{ gap: 12 }}>
        <SectionTitle>Strategy monitor</SectionTitle>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Body>Scheduled checks</Body>
            <StatusLabel label="Not enabled yet" tone="warning" />
          </View>
          <Heading>Every 30 minutes</Heading>
          <Body muted>Cloud monitoring will run after market data and the AI provider are configured. This device does not run the scheduler.</Body>
          <Body muted style={{ fontSize: 12 }}>Active strategies: {activeCount}. Saved drafts: {strategies.filter((item) => item.status === 'draft').length}.</Body>
        </Card>
      </View>

      <View style={{ gap: 12 }}>
        <SectionTitle>Next steps</SectionTitle>
        <Card>
          <Body>1. Create your virtual account</Body>
          <Body>2. Save a strategy draft</Body>
          <Body>3. Confirm the market-data and AI integrations</Body>
          <Body>4. Activate monitoring only after validation is available</Body>
          <AppButton title="Create a strategy draft" onPress={() => router.push('/new-strategy')} variant="secondary" />
        </Card>
      </View>

      {loadingData ? <Body muted>Refreshing account data…</Body> : null}
    </Screen>
  );
}
