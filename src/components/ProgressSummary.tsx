import { StyleSheet, Text, View } from 'react-native';
import { goalStats, type Goal } from '../domain/goals';
import { colors } from '../theme';
import { typography } from './ui';

export function ProgressSummary({ goals }: { goals: Goal[] }) {
  const stats = goalStats(goals);
  return <View style={styles.container}>
    <View style={styles.row}><Text style={typography.label}>{stats.active} active</Text><Text style={typography.muted}>{stats.completed} of {stats.total} complete</Text></View>
    <View accessibilityRole="progressbar" accessibilityLabel="Goals completed" accessibilityValue={{ min: 0, max: 100, now: stats.percent }} style={styles.track}>
      <View style={[styles.fill, { width: `${stats.percent}%` }]} />
    </View>
  </View>;
}
const styles = StyleSheet.create({
  container: { gap: 12, marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  track: { height: 4, backgroundColor: colors.line, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent },
});
