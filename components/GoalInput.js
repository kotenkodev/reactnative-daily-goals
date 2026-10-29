import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

function GoalInput(props) {
  const [enteredGoalText, setEnteredGoalText] = useState("");

  function goalInputHandler(enteredText) {
    setEnteredGoalText(enteredText.trim());
  }

  function onSubmit() {
    if (enteredGoalText) {
      props.onAddGoal(enteredGoalText);
      setEnteredGoalText("");
    }
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={enteredGoalText}
        style={styles.textInput}
        placeholder="Course Goal"
        placeholderTextColor="#6b6474"
        onChangeText={goalInputHandler}
      />
      <Button title="Add Goal" color="#5e0acc" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    fontSize: 16,
    color: "#25143d",
  },
});

export default GoalInput;
