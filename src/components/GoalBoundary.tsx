import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import type { ReactNode } from "react";
import type { Goal } from "../domain/goals";
import { useGoals } from "../state/GoalsProvider";
import { ActionButton, ErrorNotice, Screen, typography } from "./ui";

export function GoalBoundary({
  id,
  children,
}: {
  id: string;
  children: (goal: Goal) => ReactNode;
}) {
  const { goals, ready, loading, error, load } = useGoals();
  const goal = goals.find((item) => item.id === id);
  if (loading)
    return (
      <Screen>
        <ActivityIndicator
          accessibilityLabel="Loading goal"
          style={styles.center}
        />
      </Screen>
    );
  if (!ready)
    return (
      <Screen>
        <View style={styles.center}>
          <ErrorNotice message={error} />
          <ActionButton label="Retry loading" onPress={() => void load()} />
        </View>
      </Screen>
    );
  if (!goal)
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={typography.heading}>This goal isn’t here.</Text>
          <Text style={typography.muted}>
            It may have been deleted, or this link belongs to another device.
          </Text>
          <ActionButton
            label="Back to goals"
            onPress={() => router.replace("/")}
          />
        </View>
      </Screen>
    );
  return children(goal);
}
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
});
