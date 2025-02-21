// src/screens/GameModeSelection.js
import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";

const GameModeSelection = ({ navigation, route }) => {
  const { gameType } = route.params;

  const handleModeSelection = (mode) => {
    if (gameType === "Checkers") {
      if (mode === "AI") {
        navigation.navigate("CheckerGame", { gameMode: "AI" });
      } else {
        navigation.navigate("InviteFriendScreen", { gameType: "Checkers" });
      }
    } else if (gameType === "SnakeLadders") {
      if (mode === "AI") {
        navigation.navigate("SnakeLaddersGame", { gameMode: "AI" });
      } else {
        navigation.navigate("InviteFriendScreen", { gameType: "SnakeLadders" });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Mode for {gameType}</Text>
      <Button title="Play Against AI" onPress={() => handleModeSelection("AI")} />
      <Button title="Play Against a Friend" onPress={() => handleModeSelection("Multiplayer")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});

export default GameModeSelection;
