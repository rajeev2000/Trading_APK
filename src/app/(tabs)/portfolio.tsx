import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Eyebrow, Heading, Screen, SectionTitle, StatusLabel } from '@/components/ui';
import { formatMoney } from '@/lib/format';
import { useAppData } from '@/providers/app-data-provider';

export default function PortfolioScreen() {
  const router = useRouter();
  const { paperSession } = useAppData();

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Eyebrow>SIMULATION ONLY</Eyebrow>
        <Heading>Portfolio</Heading>
        <Body muted>Track virtual cash and simulated trade history. No brokerage account is connected.</Body>
      </View>

      {paperSession ? (
        <Card>
          <Eyebrow>AVAILABLE VIRTUAL CASH</Eyebrow>
          <Heading>{formatMoney(paperSession.cashBalanceMinor, paperSession.currency)}</Heading>
          <Body muted>Starting amount: {formatMoney(paperSession.startingCashMinor, paperSession.currency)}</Body>
          <StatusLabel label="No simulated fills yet" />
        </Card>
      ) : (
        <Card>
          <SectionTitle>Create your paper account</SectionTitle>
          <Body muted>Choose a virtual starting amount to begin tracking your paper portfolio.</Body>
          <AppButton title="Set virtual capital" onPress={() => router.push('/new-session')} />
        </Card>
      )}

      <Card>
        <SectionTitle>Performance</SectionTitle>
        <Body muted>Profit/loss, positions and simulated fills will appear after ledger and order simulation are implemented.</Body>
      </Card>
    </Screen>
  );
}
