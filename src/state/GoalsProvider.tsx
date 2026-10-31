import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  cleanDraft,
  createGoalId,
  parseGoals,
  serializeGoals,
  validateDraft,
  type Goal,
  type GoalDraft,
} from "../domain/goals";
import { successFeedback } from "../utils/feedback";
import { AccessibilityInfo } from "react-native";

const STORAGE_KEY = "@fieldnotes/goals/v1";

function useGoalStore() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const current = useRef<Goal[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const [deleted, setDeleted] = useState<Goal[]>([]);

  const load = useCallback(
    () =>
      AsyncStorage.getItem(STORAGE_KEY)
        .then((raw) => {
          const saved = parseGoals(raw);
          current.current = saved;
          setGoals(saved);
          setReady(true);
        })
        .catch(() => {
          setError(
            "Your goals could not be loaded. Your saved data has not been changed. Please retry.",
          );
        })
        .finally(() => {
          setLoading(false);
        }),
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const retryLoad = useCallback(() => {
    setLoading(true);
    setError(null);
    return load();
  }, [load]);

  const commit = useCallback(
    async (update: (value: Goal[]) => Goal[]) => {
      if (busy.current || !ready) return false;
      busy.current = true;
      setSaving(true);
      setError(null);
      try {
        const next = update(current.current);
        await AsyncStorage.setItem(STORAGE_KEY, serializeGoals(next));
        current.current = next;
        setGoals(next);
        successFeedback();
        return true;
      } catch {
        setError("This change could not be saved. Please try again.");
        return false;
      } finally {
        busy.current = false;
        setSaving(false);
      }
    },
    [ready],
  );

  const saveGoal = useCallback(
    async (draft: GoalDraft, id?: string) => {
      const validation = validateDraft(draft);
      if (validation) {
        setError(validation);
        return false;
      }
      if (id && !current.current.some((goal) => goal.id === id)) {
        setError("This goal no longer exists.");
        return false;
      }
      const clean = cleanDraft(draft);
      return commit((items) =>
        id
          ? items.map((goal) => (goal.id === id ? { ...goal, ...clean } : goal))
          : [
              {
                ...clean,
                id: createGoalId(items),
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null,
              },
              ...items,
            ],
      );
    },
    [commit],
  );

  const toggleGoal = useCallback(
    async (id: string) => {
      const goal = current.current.find((item) => item.id === id);
      if (!goal) return false;
      const success = await commit((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                completed: !item.completed,
                completedAt: item.completed ? null : new Date().toISOString(),
              }
            : item,
        ),
      );
      if (success)
        AccessibilityInfo.announceForAccessibility(
          goal.completed ? "Goal reopened" : "Goal completed",
        );
      return success;
    },
    [commit],
  );

  const deleteGoals = useCallback(
    async (ids: string[]) => {
      const removed = current.current.filter((goal) => ids.includes(goal.id));
      const success = await commit((items) =>
        items.filter((goal) => !ids.includes(goal.id)),
      );
      if (success) setDeleted(removed);
      return success;
    },
    [commit],
  );

  const undoDelete = useCallback(async () => {
    const success = await commit((items) => [
      ...items,
      ...deleted.filter((goal) => !items.some((item) => item.id === goal.id)),
    ]);
    if (success) setDeleted([]);
    return success;
  }, [commit, deleted]);

  return {
    goals,
    ready,
    loading,
    saving,
    error,
    load: retryLoad,
    saveGoal,
    toggleGoal,
    deleteGoals,
    undoDelete,
    deleted,
    dismissUndo: () => setDeleted([]),
  };
}

const GoalsContext = createContext<ReturnType<typeof useGoalStore> | null>(
  null,
);
export function GoalsProvider({ children }: { children: ReactNode }) {
  const store = useGoalStore();
  return (
    <GoalsContext.Provider value={store}>{children}</GoalsContext.Provider>
  );
}
export function useGoals() {
  const store = useContext(GoalsContext);
  if (!store) throw new Error("useGoals requires GoalsProvider");
  return store;
}
