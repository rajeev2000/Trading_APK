import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/providers/theme-provider';

export function Screen({ children }: React.PropsWithChildren) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Heading({ children }: React.PropsWithChildren) {
  const { colors } = useTheme();
  return <Text accessibilityRole="header" style={[styles.heading, { color: colors.text }]}>{children}</Text>;
}

export function SectionTitle({ children }: React.PropsWithChildren) {
  const { colors } = useTheme();
  return <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{children}</Text>;
}

export function Body({ children, muted = false, style }: React.PropsWithChildren<{ muted?: boolean; style?: StyleProp<TextStyle> }>) {
  const { colors } = useTheme();
  return <Text style={[styles.body, { color: muted ? colors.textMuted : colors.text }, style]}>{children}</Text>;
}

export function Eyebrow({ children }: React.PropsWithChildren) {
  const { colors } = useTheme();
  return <Text style={[styles.eyebrow, { color: colors.textMuted }]}>{children}</Text>;
}

export function Card({ children, style }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors } = useTheme();
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'quiet';
  disabled?: boolean;
  loading?: boolean;
}) {
  const { colors } = useTheme();
  const backgroundColor = variant === 'primary' ? colors.accent : variant === 'secondary' ? colors.surfaceMuted : 'transparent';
  const textColor = variant === 'primary' ? colors.accentText : colors.text;
  const borderColor = variant === 'secondary' ? colors.border : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.45 : pressed ? 0.76 : 1 },
        variant === 'quiet' && styles.quietButton,
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>}
    </Pressable>
  );
}

export function TextField({ label, helperText, ...props }: TextInputProps & { label: string; helperText?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        {...props}
        style={[
          styles.input,
          {
            backgroundColor: colors.field,
            borderColor: colors.border,
            color: colors.text,
          },
          props.multiline && styles.multiline,
          props.style,
        ]}
      />
      {helperText ? <Text style={[styles.helperText, { color: colors.textMuted }]}>{helperText}</Text> : null}
    </View>
  );
}

export function Divider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

export function StatusLabel({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' }) {
  const { colors } = useTheme();
  const color = tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : colors.textMuted;
  return (
    <View style={[styles.status, { borderColor: color }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screenContent: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36, gap: 18 },
  heading: { fontSize: 28, lineHeight: 34, fontWeight: '600', letterSpacing: -0.5 },
  sectionTitle: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 23 },
  eyebrow: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 1.1, textTransform: 'uppercase' },
  card: { padding: 18, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, gap: 12 },
  button: { minHeight: 50, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  quietButton: { minHeight: 44 },
  buttonText: { fontSize: 15, fontWeight: '600', textAlign: 'center' },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '600' },
  input: { minHeight: 50, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, fontSize: 16 },
  multiline: { minHeight: 140, textAlignVertical: 'top' },
  helperText: { fontSize: 12, lineHeight: 18 },
  divider: { height: StyleSheet.hairlineWidth, width: '100%', marginVertical: 2 },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', borderRadius: 20, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, gap: 7 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
});
