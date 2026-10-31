import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GoalsProvider } from "../state/GoalsProvider";
import { colors } from "../theme";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function RootLayout() {
  const reducedMotion = useReducedMotion();
  return (
    <SafeAreaProvider>
      <GoalsProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: reducedMotion ? "none" : "slide_from_right",
          }}
        />
      </GoalsProvider>
    </SafeAreaProvider>
  );
}
