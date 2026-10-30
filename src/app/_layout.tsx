import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoalsProvider } from '../state/GoalsProvider';
import { colors } from '../theme';

export default function RootLayout() {
  return <SafeAreaProvider>
    <GoalsProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }} />
    </GoalsProvider>
  </SafeAreaProvider>;
}
