import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GameSelection = ({ navigation }) => {
  return (
    <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.container}>
      <Text style={styles.title}>Choose a Game</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GameModeSelection", { gameType: "Checkers" })}
      >
        <Text style={styles.buttonText}>♟️ Play Checkers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GameModeSelection", { gameType: "SnakeLadders" })}
      >
        <Text style={styles.buttonText}>🎲 Snake & Ladders</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    marginVertical: 10,
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default GameSelection;
