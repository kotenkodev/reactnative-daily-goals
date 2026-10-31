import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanDraft,
  createGoalId,
  emptyDraft,
  goalStats,
  parseGoals,
  selectGoals,
  serializeGoals,
  validateDraft,
} from "../src/domain/goals.ts";

const goal = (id, changes = {}) => ({
  id,
  title: "Read a chapter",
  notes: "Before bed",
  category: "Learning",
  priority: "normal",
  completed: false,
  createdAt: "2026-10-01T12:00:00.000Z",
  completedAt: null,
  ...changes,
});

test("local IDs remain unique even when timestamp and random value collide", (t) => {
  t.mock.method(Date, "now", () => 1234);
  t.mock.method(Math, "random", () => 0.5);
  const first = createGoalId([]);
  const second = createGoalId([goal(first)]);
  const third = createGoalId([goal(first), goal(second)]);
  assert.equal(new Set([first, second, third]).size, 3);
});

test("rejects empty, oversized and invalid drafts", () => {
  assert.ok(validateDraft(emptyDraft));
  assert.ok(validateDraft({ ...emptyDraft, title: "   " }));
  assert.ok(validateDraft({ ...emptyDraft, title: "a".repeat(121) }));
  assert.ok(
    validateDraft({ ...emptyDraft, title: "Read", notes: "a".repeat(2001) }),
  );
  assert.ok(
    validateDraft({ ...emptyDraft, title: "Read", category: "Unknown" }),
  );
  assert.equal(validateDraft({ ...emptyDraft, title: "Read" }), null);
});

test("normalizes only outer whitespace when saving", () => {
  const draft = {
    ...emptyDraft,
    title: "  Read a chapter  ",
    notes: "  First step\nSecond step  ",
  };
  assert.equal(cleanDraft(draft).title, "Read a chapter");
  assert.equal(cleanDraft(draft).notes, "First step\nSecond step");
  assert.equal(draft.title, "  Read a chapter  ");
});

test("combines status category and case insensitive notes search", () => {
  const goals = [
    goal("a"),
    goal("b", { category: "Work" }),
    goal("c", { completed: true, completedAt: "2026-10-02T12:00:00.000Z" }),
  ];
  assert.deepEqual(
    selectGoals(goals, "active", "  BEFORE  ", "Learning", "newest").map(
      (g) => g.id,
    ),
    ["a"],
  );
  assert.deepEqual(
    selectGoals(goals, "completed", "", "All", "newest").map((g) => g.id),
    ["c"],
  );
  assert.equal(
    selectGoals(goals, "all", "unmatched", "All", "newest").length,
    0,
  );
});

test("sorts priority and dates without mutating stored order", () => {
  const goals = [
    goal("a"),
    goal("b", { createdAt: "2026-10-02T12:00:00.000Z" }),
    goal("c", { priority: "high" }),
  ];
  assert.deepEqual(
    selectGoals(goals, "all", "", "All", "priority").map((g) => g.id),
    ["c", "b", "a"],
  );
  assert.equal(selectGoals(goals, "all", "", "All", "oldest")[0].id, "a");
  assert.deepEqual(
    goals.map((g) => g.id),
    ["a", "b", "c"],
  );
});

test("round trips persisted goals and handles a fresh install", () => {
  assert.deepEqual(parseGoals(null), []);
  const goals = [
    goal("a"),
    goal("b", { completed: true, completedAt: "2026-10-02T12:00:00.000Z" }),
  ];
  assert.deepEqual(parseGoals(serializeGoals(goals)), goals);
});

test("rejects corruption and unknown schema without silently dropping data", () => {
  for (const raw of [
    "{",
    "{}",
    '{"version":2,"goals":[]}',
    serializeGoals([goal("a"), goal("a")]),
    serializeGoals([goal("a", { createdAt: "bad" })]),
    serializeGoals([goal("a", { completed: true })]),
    serializeGoals([goal("a", { notes: 3 })]),
  ]) {
    assert.throws(() => parseGoals(raw));
  }
});

test("progress is zero for an empty list and uses all goals as denominator", () => {
  assert.deepEqual(goalStats([]), {
    total: 0,
    completed: 0,
    active: 0,
    percent: 0,
  });
  assert.deepEqual(
    goalStats([goal("a"), goal("b"), goal("c", { completed: true })]),
    { total: 3, completed: 1, active: 2, percent: 33 },
  );
});
