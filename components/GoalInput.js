import { useState } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Modal,
  Image,
} from "react-native";

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
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        <Image style={styles.image} source={require("../assets/goal.png")} />
        <TextInput
          value={enteredGoalText}
          style={styles.textInput}
          placeholder="Course Goal"
          placeholderTextColor="#6b6474"
          onChangeText={goalInputHandler}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Add Goal" color="#5e0acc" onPress={onSubmit} />
          </View>
          <View style={styles.button}>
            <Button title="Cancel" color="#f31282" onPress={props.onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    backgroundColor: "#311b6b",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  button: {
    width: 100,
    marginHorizontal: 8,
  },
});

export default GoalInput;
