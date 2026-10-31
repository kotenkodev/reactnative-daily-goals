import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  ActionButton,
  ErrorNotice,
  Screen,
  typography,
} from "../components/ui";
import { ProgressSummary } from "../components/ProgressSummary";
import { categories, goalStats } from "../domain/goals";
import { useGoals } from "../state/GoalsProvider";
import { colors } from "../theme";

export default function Progress() {
  const { goals, ready, loading, error, load } = useGoals();
  return (
    <Screen>
      <View style={styles.back}>
        <ActionButton
          label="‹  Goals"
          variant="quiet"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
        />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.eyebrow}>THE BIGGER PICTURE</Text>
        <Text accessibilityRole="header" style={typography.title}>
          Progress, at{"\n"}your own pace.
        </Text>
        <Text style={typography.muted}>
          Every finished goal is a step worth keeping.
        </Text>
        {loading ? (
          <ActivityIndicator />
        ) : !ready ? (
          <>
            <ErrorNotice message={error} />
            <ActionButton label="Retry loading" onPress={() => void load()} />
          </>
        ) : (
          <>
            <ProgressSummary goals={goals} />
            <Text style={typography.heading}>By category</Text>
            {categories.map((category) => {
              const stats = goalStats(
                goals.filter((goal) => goal.category === category),
              );
              return (
                <View key={category} style={styles.category}>
                  <Text style={typography.body}>{category}</Text>
                  <Text style={typography.muted}>
                    {stats.completed} / {stats.total} done
                  </Text>
                </View>
              );
            })}
            <Text style={styles.note}>
              {goals.length
                ? "This is a record of your goals, not a score to chase."
                : "Your progress will appear as you add and finish goals."}
            </Text>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  back: { alignItems: "flex-start", padding: 12 },
  content: { padding: 24, gap: 20 },
  category: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  note: { ...typography.muted, marginTop: 16 },
});
