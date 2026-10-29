import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";

export default function App() {
  const [goals, setGoals] = useState([]);

  function addGoalHandler(enteredGoalText) {
    if (enteredGoalText === "") {
      return;
    }
    setGoals((currentGoals) => [
      ...currentGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
  }

  return (
    <View style={styles.appContainer}>
      <GoalInput onAddGoal={addGoalHandler} />

      <View style={styles.goalsContainer}>
        <Text style={styles.sectionTitle}>List of Goals</Text>
        <FlatList
          style={styles.goalList}
          contentContainerStyle={styles.goalListContent}
          data={goals}
          renderItem={({ item }) => <GoalItem text={item.text} />}
          keyExtractor={(item) => item.id}
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  goalsContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "600",
    color: "#25143d",
  },
  goalList: {
    flex: 1,
  },
  goalListContent: {
    paddingBottom: 32,
  },
});
