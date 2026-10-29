import { Button, StyleSheet, Text, View } from "react-native";

function GoalItem(props) {
  return (
    <View style={styles.goalItem}>
      <Text style={styles.goalItemText}>{props.text}</Text>
      <Button
        android_ripple={{ color: "#cccccc" }}
        onPress={() => props.onDelete(props.id)}
        title="X"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  goalItem: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    backgroundColor: "#5e0acc",
  },
  goalItemText: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default GoalItem;
