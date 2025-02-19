import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CheckerBoard from "../components/CheckerBoard";

const CheckerGame = ({ route }) => {
  const { gameMode } = route.params; // AI or Multiplayer

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkers Game ({gameMode})</Text>
      <CheckerBoard gameMode={gameMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default CheckerGame;
