import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ActionButton, ErrorNotice, Screen, typography } from '../components/ui';
import { GoalRow } from '../components/GoalRow';
import { useGoals } from '../state/GoalsProvider';
import { colors } from '../theme';
import { GoalFilters, defaultFilters } from '../components/GoalFilters';
import { selectGoals } from '../domain/goals';

export default function GoalsScreen() {
  const { goals, ready, loading, saving, error, load, toggleGoal } = useGoals();
  const [filters, setFilters] = useState(defaultFilters);
  const visibleGoals = useMemo(() => selectGoals(goals, filters.status, filters.query, filters.category, filters.sort), [goals, filters]);
  const onToggle = useCallback((id: string) => { void toggleGoal(id); }, [toggleGoal]);
  return <Screen>
    <View style={styles.brand}><Text style={typography.eyebrow}>FIELDNOTES / GOALS</Text></View>
    <View style={styles.notice}><ErrorNotice message={error} /></View>
    {loading ? <ActivityIndicator accessibilityLabel="Loading goals" color={colors.accent} style={styles.loading} /> : !ready ?
      <View style={styles.notice}><ActionButton label="Retry loading" onPress={() => void load()} /></View> :
      <FlatList data={visibleGoals} keyExtractor={(item) => item.id} contentContainerStyle={styles.list}
        renderItem={({ item }) => <GoalRow goal={item} onToggle={onToggle} disabled={saving} />}
        ListHeaderComponent={<>
    <View style={styles.header}>
      <Text accessibilityRole="header" style={typography.title}>Make room for{ '\n' }what matters.</Text>
      <Text style={typography.muted}>Small steps. A little more intention.</Text>
    </View>
    <GoalFilters value={filters} onChange={setFilters} />
    <Text style={[typography.eyebrow, styles.listHeading]}>{filters.status === 'completed' ? 'COMPLETED' : 'YOUR GOALS'} · {visibleGoals.length}</Text></>}
        ListEmptyComponent={<View style={styles.empty}><Text style={typography.heading}>{goals.length ? 'Nothing here just yet.' : 'A little space to begin.'}</Text><Text style={typography.muted}>{goals.length ? 'Try another filter or search to find your goals.' : 'Choose one thing you want to move forward. Your first goal starts here.'}</Text>{goals.length > 0 && <ActionButton label="Show all goals" variant="secondary" onPress={() => setFilters({ ...defaultFilters, status: 'all' })} />}</View>}
        keyboardShouldPersistTaps="handled" />}
    <View style={styles.footer}><ActionButton label="＋  New goal" disabled={!ready || saving} onPress={() => router.push('/goal/new')} /></View>
  </Screen>;
}

const styles = StyleSheet.create({
  brand: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  header: { paddingTop: 20, paddingBottom: 24, gap: 12 },
  notice: { paddingHorizontal: 24 },
  loading: { flex: 1 },
  list: { paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 },
  listHeading: { marginVertical: 20 },
  empty: { paddingVertical: 48, gap: 12 },
  footer: { padding: 16, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: colors.line },
});
