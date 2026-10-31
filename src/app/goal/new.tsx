import { GoalEditor } from "../../components/GoalEditor";
import { useGoals } from "../../state/GoalsProvider";
import { ActionButton, ErrorNotice, Screen } from "../../components/ui";
import { ActivityIndicator } from "react-native";

export default function NewGoal() {
  const { ready, loading, error, load } = useGoals();
  if (!ready)
    return (
      <Screen>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <ErrorNotice message={error} />
            <ActionButton label="Retry loading" onPress={() => void load()} />
          </>
        )}
      </Screen>
    );
  return <GoalEditor />;
}
