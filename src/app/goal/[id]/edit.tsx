import { useLocalSearchParams } from 'expo-router';
import { GoalBoundary } from '../../../components/GoalBoundary';
import { GoalEditor } from '../../../components/GoalEditor';

export default function EditGoal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <GoalBoundary id={id}>{(goal) => <GoalEditor key={goal.id} goal={goal} />}</GoalBoundary>;
}
