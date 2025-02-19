import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";

const GameModeSelection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Mode</Text>
      <Button title="Play Against AI" onPress={() => navigation.navigate("CheckerGame", { gameMode: "AI" })} />
      <Button title="Play Against a Friend" onPress={() => navigation.navigate("InviteFriendScreen")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default GameModeSelection;