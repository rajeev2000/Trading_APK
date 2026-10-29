import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Eyebrow, Heading, Screen, SectionTitle, StatusLabel } from '@/components/ui';
import { useAppData } from '@/providers/app-data-provider';
import { useTheme } from '@/providers/theme-provider';

export default function StrategiesScreen() {
  const router = useRouter();
  const { strategies } = useAppData();
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Eyebrow>RULES BEFORE SIGNALS</Eyebrow>
        <Heading>Strategies</Heading>
        <Body muted>Keep each idea clear, testable, and easy to review.</Body>
      </View>

      <AppButton title="＋ New strategy draft" onPress={() => router.push('/new-strategy')} />

      {strategies.length === 0 ? (
        <Card>
          <SectionTitle>No strategies yet</SectionTitle>
          <Body muted>Start with a plain-English rule. It will be saved as a draft until AI parsing, validation, and confirmation are implemented.</Body>
          <AppButton title="Write your first draft" onPress={() => router.push('/new-strategy')} variant="secondary" />
        </Card>
      ) : strategies.map((strategy) => (
        <Card key={strategy.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Eyebrow>VERSION {strategy.version}</Eyebrow>
            <StatusLabel label={strategy.status.toUpperCase()} />
          </View>
          <Heading>{strategy.symbol || strategy.market}</Heading>
          <Body>{strategy.originalPrompt}</Body>
          <Body muted style={{ fontSize: 12 }}>Market: {strategy.market} · Not scheduled</Body>
          <View style={{ borderLeftWidth: 2, borderLeftColor: colors.border, paddingLeft: 12 }}>
            <Body muted style={{ fontSize: 12 }}>Draft only. The app has not interpreted or evaluated this strategy yet.</Body>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
