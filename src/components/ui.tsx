import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout } from '../theme';
import type { ReactNode } from 'react';

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
    <View style={styles.screen}>{children}</View>
  </SafeAreaView>;
}

type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  busy?: boolean;
  style?: StyleProp<ViewStyle>;
};
export function ActionButton({ label, variant = 'primary', busy = false, disabled, style, ...props }: ButtonProps) {
  const dark = variant === 'primary';
  return <Pressable {...props} accessibilityRole="button" accessibilityState={{ disabled: !!disabled || busy, busy }} disabled={disabled || busy}
    android_ripple={{ color: dark ? '#FFFFFF30' : colors.ripple }}
    style={({ pressed }) => [styles.button, styles[variant], style, pressed && styles.pressed, (disabled || busy) && styles.disabled]}>
    {busy && <ActivityIndicator size="small" color={dark ? colors.accentText : colors.accent} />}
    <Text style={[styles.buttonText, dark && styles.lightText, variant === 'danger' && styles.dangerText]}>{label}</Text>
  </Pressable>;
}

export function Choice({ label, selected, onPress, disabled = false }: { label: string; selected: boolean; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected, disabled }} disabled={disabled} onPress={onPress}
    android_ripple={{ color: colors.ripple }} style={({ pressed }) => [styles.choice, selected && styles.selected, pressed && styles.pressed, disabled && styles.disabled]}>
    <Text style={[styles.choiceText, selected && styles.selectedText]}>{label}</Text>
  </Pressable>;
}

export function ErrorNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return <View style={styles.error} accessibilityLiveRegion="polite"><Text style={styles.dangerText}>{message}</Text></View>;
}

export const typography = StyleSheet.create({
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, color: colors.muted, textTransform: 'uppercase' },
  title: { fontSize: 34, lineHeight: 41, fontWeight: '700', letterSpacing: -1.2, color: colors.ink },
  heading: { fontSize: 21, lineHeight: 28, fontWeight: '600', color: colors.ink },
  body: { fontSize: 16, lineHeight: 24, color: colors.ink },
  muted: { fontSize: 14, lineHeight: 21, color: colors.muted },
  label: { fontSize: 14, fontWeight: '600', color: colors.ink },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' },
  button: { minHeight: layout.touchSize, borderRadius: layout.radius, paddingHorizontal: 18, paddingVertical: 13, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.accentSoft },
  quiet: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.dangerSoft },
  buttonText: { fontSize: 15, lineHeight: 22, fontWeight: '600', color: colors.accent, textAlign: 'center' },
  lightText: { color: colors.accentText },
  dangerText: { color: colors.danger, fontSize: 14, lineHeight: 21 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
  choice: { minHeight: layout.touchSize, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 10, justifyContent: 'center', overflow: 'hidden' },
  selected: { backgroundColor: colors.accentSoft },
  choiceText: { fontSize: 14, fontWeight: '500', color: colors.muted },
  selectedText: { color: colors.accent, fontWeight: '700' },
  error: { padding: 14, borderRadius: 10, backgroundColor: colors.dangerSoft, marginVertical: 8 },
});
