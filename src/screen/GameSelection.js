import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";

const GameSelection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Game</Text>
      <Button title="Checkers" onPress={() => navigation.navigate("GameModeSelection")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default GameSelection;
