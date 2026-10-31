import { StyleSheet, Text, View } from "react-native";
import { useGoals } from "../state/GoalsProvider";
import { ActionButton, typography } from "./ui";
import { colors } from "../theme";

export function UndoNotice({ onRestored }: { onRestored: () => void }) {
  const { deleted, saving, undoDelete, dismissUndo } = useGoals();
  if (!deleted.length) return null;
  return (
    <View style={styles.notice} accessibilityLiveRegion="polite">
      <Text style={typography.label}>
        {deleted.length === 1
          ? "Goal deleted"
          : `${deleted.length} goals deleted`}
      </Text>
      <View style={styles.actions}>
        <ActionButton
          label="Undo"
          variant="secondary"
          disabled={saving}
          onPress={() => {
            void undoDelete().then((success) => {
              if (success) onRestored();
            });
          }}
        />
        <ActionButton
          label="Dismiss"
          variant="quiet"
          disabled={saving}
          onPress={dismissUndo}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.accentSoft,
    padding: 12,
    paddingLeft: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
});
