import { useRef, useState, type ComponentRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, usePreventRemove } from "expo-router";
import { ActionButton, Choice, ErrorNotice, Screen, typography } from "./ui";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  categories,
  emptyDraft,
  validateDraft,
  type Goal,
  type GoalDraft,
} from "../domain/goals";
import { useGoals } from "../state/GoalsProvider";
import { colors } from "../theme";

export function GoalEditor({ goal }: { goal?: Goal }) {
  const initial: GoalDraft = goal
    ? {
        title: goal.title,
        notes: goal.notes,
        category: goal.category,
        priority: goal.priority,
      }
    : emptyDraft;
  const [draft, setDraft] = useState<GoalDraft>(initial);
  const [validation, setValidation] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [focused, setFocused] = useState<"title" | "notes" | null>(null);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);
  const { saveGoal, saving, error } = useGoals();
  const titleRef = useRef<ComponentRef<typeof TextInput>>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const disablePrevention = usePreventRemove(
    !leaving && (dirty || saving),
    ({ repeat }) => {
      if (!saving) setPendingLeave(() => repeat);
    },
  );
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/");

  async function submit() {
    const issue = validateDraft(draft);
    setValidation(issue);
    if (issue) {
      titleRef.current?.focus();
      return;
    }
    if (await saveGoal(draft, goal?.id)) {
      setLeaving(true);
      disablePrevention();
      goBack();
    }
  }

  return (
    <Screen>
      <View style={styles.toolbar}>
        <ActionButton
          label="Cancel"
          variant="quiet"
          disabled={saving}
          onPress={goBack}
        />
        <Text style={typography.eyebrow}>
          {goal ? "EDIT GOAL" : "NEW GOAL"}
        </Text>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.form}
        >
          <Text accessibilityRole="header" style={typography.title}>
            {goal ? "Keep it moving." : "One step forward."}
          </Text>
          <Text style={typography.muted}>
            Make it specific enough to know when you’re done.
          </Text>
          <View style={styles.field}>
            <Text nativeID="goal-title-label" style={typography.label}>
              What would you like to do?
            </Text>
            <TextInput
              ref={titleRef}
              accessibilityLabel="Goal title"
              accessibilityLabelledBy="goal-title-label"
              value={draft.title}
              onChangeText={(title) => {
                setDraft({ ...draft, title });
                setValidation(null);
              }}
              editable={!saving}
              maxLength={120}
              onFocus={() => setFocused("title")}
              onBlur={() => setFocused(null)}
              selectionColor={colors.accent}
              placeholder="Read a chapter before bed"
              placeholderTextColor={colors.muted}
              style={[
                styles.titleInput,
                focused === "title" && styles.focused,
                !!validation && styles.invalid,
              ]}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.counter}>{draft.title.length}/120</Text>
          </View>
          <View style={styles.field}>
            <Text style={typography.label}>Category</Text>
            <View style={styles.choices}>
              {categories.map((category) => (
                <Choice
                  key={category}
                  label={category}
                  disabled={saving}
                  selected={draft.category === category}
                  onPress={() => setDraft({ ...draft, category })}
                />
              ))}
            </View>
          </View>
          <View style={styles.field}>
            <Text style={typography.label}>Priority</Text>
            <View style={styles.choices}>
              <Choice
                label="Normal"
                disabled={saving}
                selected={draft.priority === "normal"}
                onPress={() => setDraft({ ...draft, priority: "normal" })}
              />
              <Choice
                label="High priority"
                disabled={saving}
                selected={draft.priority === "high"}
                onPress={() => setDraft({ ...draft, priority: "high" })}
              />
            </View>
          </View>
          <View style={styles.field}>
            <Text style={typography.label}>
              Notes <Text style={typography.muted}> · optional</Text>
            </Text>
            <TextInput
              accessibilityLabel="Goal notes, optional"
              value={draft.notes}
              onChangeText={(notes) => setDraft({ ...draft, notes })}
              onFocus={() => setFocused("notes")}
              onBlur={() => setFocused(null)}
              selectionColor={colors.accent}
              editable={!saving}
              multiline
              maxLength={2000}
              placeholder="A first step, a reason, or a useful reminder…"
              placeholderTextColor={colors.muted}
              style={[styles.notes, focused === "notes" && styles.focused]}
              textAlignVertical="top"
            />
          </View>
          <ErrorNotice message={validation || error} />
          <ActionButton
            label={saving ? "Saving…" : goal ? "Save changes" : "Add goal"}
            busy={saving}
            onPress={() => void submit()}
          />
          <Text style={styles.footnote}>
            Saved on this device. No account needed.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <ConfirmDialog
        visible={!!pendingLeave}
        title="Leave this draft?"
        message="Your unsaved changes will be lost."
        confirmLabel="Discard changes"
        onCancel={() => setPendingLeave(null)}
        onConfirm={() => {
          setLeaving(true);
          pendingLeave?.();
          setPendingLeave(null);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  toolbar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 24,
  },
  form: { padding: 24, paddingTop: 12, gap: 16, paddingBottom: 40 },
  field: { gap: 10, marginTop: 8 },
  titleInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },
  counter: { textAlign: "right", color: colors.muted, fontSize: 12 },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  notes: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 16,
    minHeight: 128,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  },
  footnote: { textAlign: "center", fontSize: 12, color: colors.muted },
  focused: { borderColor: colors.accent, backgroundColor: "#FCFEFC" },
  invalid: { borderColor: colors.danger },
});
