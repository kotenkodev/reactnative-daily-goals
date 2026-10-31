import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  categories,
  type Category,
  type GoalFilter,
  type GoalSort,
} from "../domain/goals";
import { ActionButton, Choice, typography } from "./ui";
import { colors } from "../theme";

export type Filters = {
  query: string;
  status: GoalFilter;
  category: Category | "All";
  sort: GoalSort;
};
export const defaultFilters: Filters = {
  query: "",
  status: "active",
  category: "All",
  sort: "newest",
};

export function GoalFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          accessibilityLabel="Search goals and notes"
          placeholder="Search goals"
          placeholderTextColor={colors.muted}
          value={value.query}
          onChangeText={(query) => onChange({ ...value, query })}
          style={styles.search}
          returnKeyType="search"
          autoCorrect={false}
        />
        {!!value.query && (
          <ActionButton
            label="Clear"
            variant="quiet"
            onPress={() => onChange({ ...value, query: "" })}
          />
        )}
      </View>
      <View style={styles.status}>
        {(["active", "all", "completed"] as const).map((status) => (
          <Choice
            key={status}
            label={
              status === "active"
                ? "Active"
                : status === "all"
                  ? "All goals"
                  : "Done"
            }
            selected={value.status === status}
            onPress={() => onChange({ ...value, status })}
          />
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        keyboardShouldPersistTaps="handled"
      >
        {(["All", ...categories] as const).map((category) => (
          <Choice
            key={category}
            label={category}
            selected={value.category === category}
            onPress={() => onChange({ ...value, category })}
          />
        ))}
      </ScrollView>
      <View style={styles.sort}>
        <Text style={typography.muted}>Sort by</Text>
        <ActionButton
          label={
            value.sort === "newest"
              ? "Newest first ↓"
              : value.sort === "oldest"
                ? "Oldest first ↑"
                : "Priority first ↓"
          }
          variant="quiet"
          accessibilityHint="Cycles through newest, priority, and oldest first"
          onPress={() =>
            onChange({
              ...value,
              sort:
                value.sort === "newest"
                  ? "priority"
                  : value.sort === "priority"
                    ? "oldest"
                    : "newest",
            })
          }
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: 10 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  search: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.ink,
  },
  status: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingBottom: 10,
  },
  categories: { gap: 2 },
  sort: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});
