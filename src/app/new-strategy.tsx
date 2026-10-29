import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Heading, Screen, TextField } from '@/components/ui';
import { useAppData } from '@/providers/app-data-provider';
import { useTheme } from '@/providers/theme-provider';

export default function NewStrategyScreen() {
  const router = useRouter();
  const { addStrategyDraft } = useAppData();
  const { colors } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [market, setMarket] = useState('');
  const [symbol, setSymbol] = useState('');
  const [busy, setBusy] = useState(false);

  const onSave = async () => {
    setBusy(true);
    try {
      await addStrategyDraft(prompt, market, symbol || null);
      router.back();
    } catch (error) {
      Alert.alert('Strategy draft', error instanceof Error ? error.message : 'Unable to save this draft.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={{ gap: 8, paddingTop: 10 }}>
        <Body muted style={{ color: colors.textMuted }}>STRATEGY / NEW DRAFT</Body>
        <Heading>Write the rule in your words.</Heading>
        <Body muted>Start simple. You will review the structured rule before activation is available.</Body>
      </View>

      <Card>
        <TextField
          label="Strategy description"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          placeholder="Example: Alert me when the closing price crosses above its 20-period moving average and volume is twice the 20-period average."
          helperText="Be specific about the conditions you want checked."
        />
        <TextField
          label="Market or asset class"
          value={market}
          onChangeText={setMarket}
          placeholder="For example: NSE equities"
          helperText="Enter the market you have in mind. Supported markets will be defined after a data provider is selected."
        />
        <TextField
          label="Symbol (optional)"
          value={symbol}
          onChangeText={setSymbol}
          autoCapitalize="characters"
          placeholder="For example: INFY"
        />
        <AppButton title="Save as draft" onPress={onSave} loading={busy} />
      </Card>

      <Card>
        <Heading>Before you activate</Heading>
        <Body muted>AI parsing, rule validation, market-data integration and the 30-minute monitor are not enabled in this starter. Saving a draft will not generate alerts or trades.</Body>
      </Card>
    </Screen>
  );
}
