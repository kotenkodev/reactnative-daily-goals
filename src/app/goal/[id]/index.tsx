import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GoalBoundary } from '../../../components/GoalBoundary';
import { ActionButton, ErrorNotice, Screen, typography } from '../../../components/ui';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useGoals } from '../../../state/GoalsProvider';
import { colors } from '../../../theme';

export default function GoalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { saving, error, toggleGoal, deleteGoals } = useGoals();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return <GoalBoundary id={id}>{(goal) => <Screen>
    <View style={styles.toolbar}><ActionButton label="‹  Goals" variant="quiet" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
      <ActionButton label="Edit" variant="quiet" disabled={saving} onPress={() => router.push({ pathname: '/goal/[id]/edit', params: { id } })} /></View>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={typography.eyebrow}>{goal.category} / {goal.completed ? 'COMPLETED' : 'IN PROGRESS'}</Text>
      <Text accessibilityRole="header" selectable style={typography.title}>{goal.title}</Text>
      {goal.priority === 'high' && <Text style={styles.priority}>High priority</Text>}
      <View style={styles.rule} />
      <Text style={typography.label}>Notes</Text>
      <Text selectable style={goal.notes ? typography.body : typography.muted}>{goal.notes || 'No notes yet. Add a first step or a little context when you’re ready.'}</Text>
      <View style={styles.rule} />
      <Text style={typography.muted}>Created {new Date(goal.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
      {goal.completedAt && <Text style={typography.muted}>Completed {new Date(goal.completedAt).toLocaleDateString()}</Text>}
      <ErrorNotice message={error} />
      <ActionButton label={goal.completed ? 'Reopen goal' : 'Mark complete'} busy={saving} onPress={() => void toggleGoal(id)} />
      <ActionButton label="Delete goal" variant="danger" disabled={saving} onPress={() => setConfirmDelete(true)} />
    </ScrollView>
    <ConfirmDialog visible={confirmDelete} title="Delete this goal?" message="You can undo this from your goals list until the next deletion or app restart." confirmLabel="Delete goal" onCancel={() => setConfirmDelete(false)}
      onConfirm={() => { setConfirmDelete(false); void deleteGoals([id]).then((success) => { if (success) router.dismissTo('/'); }); }} />
  </Screen>}</GoalBoundary>;
}
const styles = StyleSheet.create({
  toolbar: { padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  content: { padding: 24, gap: 18, paddingBottom: 40 },
  rule: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  priority: { color: colors.warm, fontWeight: '600', fontSize: 14 },
});
