export const categories = ["Personal", "Learning", "Work", "Health"] as const;
export type Category = (typeof categories)[number];
export type Priority = "normal" | "high";
export type Goal = {
  id: string;
  title: string;
  notes: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
};
export type GoalDraft = Pick<Goal, "title" | "notes" | "category" | "priority">;
export type GoalFilter = "active" | "all" | "completed";
export type GoalSort = "newest" | "priority" | "oldest";
export const emptyDraft: GoalDraft = {
  title: "",
  notes: "",
  category: "Personal",
  priority: "normal",
};

// Local record keys, not security tokens. Check persisted IDs even after a restart.
export function createGoalId(goals: Goal[]) {
  const base = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const existing = new Set(goals.map((goal) => goal.id));
  let id = base;
  let suffix = 0;
  while (existing.has(id)) id = `${base}-${++suffix}`;
  return id;
}

export function validateDraft(draft: GoalDraft): string | null {
  if (!draft.title.trim()) return "Give your goal a short, clear title.";
  if (draft.title.trim().length > 120)
    return "Keep the title to 120 characters or fewer.";
  if (draft.notes.length > 2000)
    return "Keep notes to 2,000 characters or fewer.";
  if (!categories.includes(draft.category)) return "Choose a valid category.";
  if (!["normal", "high"].includes(draft.priority))
    return "Choose a valid priority.";
  return null;
}

export function cleanDraft(draft: GoalDraft): GoalDraft {
  return { ...draft, title: draft.title.trim(), notes: draft.notes.trim() };
}

export function selectGoals(
  goals: Goal[],
  filter: GoalFilter,
  query: string,
  category: Category | "All",
  sort: GoalSort,
) {
  const search = query.trim().toLocaleLowerCase();
  return goals
    .filter((goal) => {
      const matchesStatus =
        filter === "all" || goal.completed === (filter === "completed");
      const matchesCategory = category === "All" || goal.category === category;
      const matchesSearch = `${goal.title} ${goal.notes}`
        .toLocaleLowerCase()
        .includes(search);
      return matchesStatus && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "priority" && a.priority !== b.priority)
        return a.priority === "high" ? -1 : 1;
      const byDate = Date.parse(b.createdAt) - Date.parse(a.createdAt);
      return (sort === "oldest" ? -byDate : byDate) || a.id.localeCompare(b.id);
    });
}

export function goalStats(goals: Goal[]) {
  const completed = goals.filter((goal) => goal.completed).length;
  return {
    total: goals.length,
    completed,
    active: goals.length - completed,
    percent: goals.length ? Math.round((completed / goals.length) * 100) : 0,
  };
}

// Reject unsupported or malformed data rather than replacing it with an empty list.
export function parseGoals(raw: string | null): Goal[] {
  if (raw === null) return [];
  const data: unknown = JSON.parse(raw);
  if (
    !data ||
    typeof data !== "object" ||
    !("version" in data) ||
    data.version !== 1 ||
    !("goals" in data) ||
    !Array.isArray(data.goals)
  ) {
    throw new Error("Unsupported saved data");
  }
  const ids = new Set<string>();
  for (const value of data.goals) {
    const goal = value as Goal;
    if (
      !goal ||
      typeof goal.id !== "string" ||
      !goal.id ||
      ids.has(goal.id) ||
      typeof goal.title !== "string" ||
      typeof goal.notes !== "string" ||
      validateDraft(goal) ||
      typeof goal.completed !== "boolean" ||
      typeof goal.createdAt !== "string" ||
      !Number.isFinite(Date.parse(goal.createdAt)) ||
      (goal.completedAt !== null &&
        (typeof goal.completedAt !== "string" ||
          !Number.isFinite(Date.parse(goal.completedAt)))) ||
      goal.completed !== (goal.completedAt !== null)
    ) {
      throw new Error("Invalid saved goal");
    }
    ids.add(goal.id);
  }
  return data.goals as Goal[];
}

export function serializeGoals(goals: Goal[]) {
  return JSON.stringify({ version: 1, goals });
}
