import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";

export default function App() {
  const [goals, setGoals] = useState([]);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  function addGoalHandler(enteredGoalText) {
    if (enteredGoalText === "") {
      return;
    }
    setGoals((currentGoals) => [
      ...currentGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
  }

  function deleteGoalHandler(id) {
    setGoals((currentGoals) => {
      return currentGoals.filter((goal) => goal.id !== id);
    });
  }

  function showAddGoalModal() {
    setModalIsVisible(true);
  }

  function hideAddGoalModal() {
    setModalIsVisible(false);
  }

  return (
    <View style={styles.appContainer}>
      <Button title="Add New Goal" color="#5e0acc" onPress={showAddGoalModal} />

      <GoalInput
        visible={modalIsVisible}
        onAddGoal={addGoalHandler}
        onCancel={hideAddGoalModal}
      />

      <View style={styles.goalsContainer}>
        <Text style={styles.sectionTitle}>List of Goals</Text>
        <FlatList
          style={styles.goalList}
          contentContainerStyle={styles.goalListContent}
          data={goals}
          renderItem={({ item }) => (
            <GoalItem
              onDelete={deleteGoalHandler}
              id={item.id}
              text={item.text}
            />
          )}
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
