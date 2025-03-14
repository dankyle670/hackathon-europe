import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GameModeSelection = ({ navigation, route }) => {
  const { gameType } = route.params;

  const handleModeSelection = (mode) => {
    if (gameType === "Checkers") {
      navigation.navigate(mode === "AI" ? "CheckerGame" : "InviteFriendScreen", { gameType });
    } else if (gameType === "SnakeLadders") {
      navigation.navigate(mode === "AI" ? "SnakeLaddersGame" : "InviteFriendScreen", { gameType });
    }
  };

  return (
    <LinearGradient colors={["#ff7eb3", "#ff758c"]} style={styles.container}>
      <Text style={styles.title}>Choose Mode for {gameType}</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleModeSelection("AI")}>
        <Text style={styles.buttonText}>🤖 Play Against AI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleModeSelection("Multiplayer")}>
        <Text style={styles.buttonText}>👥 Play With a Friend</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
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

export default GameModeSelection;
