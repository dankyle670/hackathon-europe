import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import WebSocketService from "../api/websocketService";
import CheckerBoard from "../components/CheckerBoard";

const CheckerGame = ({ route }) => {
  const { gameMode, friendId, userId } = route.params; // Multiplayer or AI mode

  const [waitingForFriend, setWaitingForFriend] = useState(gameMode === "Multiplayer");
  const [opponentConnected, setOpponentConnected] = useState(false);

  useEffect(() => {
    if (gameMode === "Multiplayer") {
      WebSocketService.connect(userId);

      // Listen for game invite acceptance
      WebSocketService.onInviteAccepted(() => {
        setWaitingForFriend(false);
        setOpponentConnected(true);
      });

      // Listen for opponent connection
      WebSocketService.onOpponentMove(() => {
        setOpponentConnected(true);
      });
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [gameMode]);

  return (
    <View style={styles.container}>
      {gameMode === "Multiplayer" && waitingForFriend ? (
        <Text style={styles.title}>Waiting for Friend to Accept...</Text>
      ) : (
        <>
          <Text style={styles.title}>
            {gameMode === "AI" ? "Playing Against AI" : opponentConnected ? "Playing with a Friend" : "Waiting for Opponent..."}
          </Text>
          <CheckerBoard gameMode={gameMode} friendId={friendId} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});

export default CheckerGame;
