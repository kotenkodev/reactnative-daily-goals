import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import type { Goal } from "../domain/goals";
import { colors } from "../theme";

export const GoalRow = memo(function GoalRow({
  goal,
  onToggle,
  disabled,
}: {
  goal: Goal;
  onToggle: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={goal.title}
        accessibilityState={{ checked: goal.completed, disabled }}
        accessibilityHint="Changes whether this goal is complete"
        disabled={disabled}
        onPress={() => onToggle(goal.id)}
        android_ripple={{ color: colors.ripple, borderless: true }}
        style={styles.checkTarget}
      >
        <View style={[styles.check, goal.completed && styles.checked]}>
          <Text style={styles.checkMark}>{goal.completed ? "✓" : ""}</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${goal.title}`}
        onPress={() =>
          router.push({ pathname: "/goal/[id]", params: { id: goal.id } })
        }
        android_ripple={{ color: colors.ripple }}
        style={({ pressed }) => [styles.content, pressed && { opacity: 0.65 }]}
      >
        <Text style={[styles.title, goal.completed && styles.completed]}>
          {goal.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.category}>{goal.category}</Text>
          {goal.priority === "high" && (
            <Text style={styles.priority}>Priority</Text>
          )}
          {goal.notes.length > 0 && <Text style={styles.category}>Notes</Text>}
        </View>
      </Pressable>
      <Text accessible={false} style={styles.arrow}>
        ›
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  checkTarget: {
    width: 56,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#8B998E",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkMark: {
    color: "white",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
  },
  content: { flex: 1, paddingVertical: 20, paddingRight: 8, minHeight: 80 },
  title: { fontSize: 17, lineHeight: 25, color: colors.ink, fontWeight: "500" },
  completed: { textDecorationLine: "line-through", color: colors.muted },
  meta: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 6,
  },
  category: { fontSize: 12, lineHeight: 18, color: colors.muted },
  priority: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.warm,
    fontWeight: "600",
  },
  arrow: { fontSize: 25, color: colors.muted, marginRight: 16 },
});
