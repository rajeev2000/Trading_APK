import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppButton, Body, Card, Heading, Screen, TextField } from '@/components/ui';
import { amountToMinorUnits } from '@/lib/format';
import { useAppData } from '@/providers/app-data-provider';
import { useTheme } from '@/providers/theme-provider';

export default function NewSessionScreen() {
  const router = useRouter();
  const { createPaperSession } = useAppData();
  const { colors } = useTheme();
  const [amount, setAmount] = useState('100000');
  const [currency, setCurrency] = useState('INR');
  const [busy, setBusy] = useState(false);

  const onCreate = async () => {
    setBusy(true);
    try {
      await createPaperSession(amountToMinorUnits(amount), currency);
      router.back();
    } catch (error) {
      Alert.alert('Paper session', error instanceof Error ? error.message : 'Unable to create the session.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={{ gap: 8, paddingTop: 10 }}>
        <Body muted style={{ color: colors.textMuted }}>PAPER ACCOUNT / SETUP</Body>
        <Heading>Create your paper session</Heading>
        <Body muted>Choose an amount of fictional cash to use for testing ideas. No money will be charged or transferred.</Body>
      </View>

      <Card>
        <TextField
          label="Virtual starting amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="100000"
          helperText="Enter the amount in the selected currency, not minor units."
        />
        <TextField
          label="Currency code"
          value={currency}
          onChangeText={(value) => setCurrency(value.toUpperCase().slice(0, 3))}
          autoCapitalize="characters"
          maxLength={3}
          placeholder="INR"
          helperText="Use a three-letter currency code, for example INR or USD."
        />
        <AppButton title="Create virtual account" onPress={onCreate} loading={busy} />
        <AppButton title="Cancel" variant="quiet" onPress={() => router.back()} />
      </Card>

      <Body muted style={{ fontSize: 12 }}>This account is a simulator. Live trading, broker connections, deposits and withdrawals are not supported.</Body>
    </Screen>
  );
}
