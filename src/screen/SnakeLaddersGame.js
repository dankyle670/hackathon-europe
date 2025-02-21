import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import WebSocketService from "../api/websocketService";
import { generateSnakesAndLadders, getDiceValue, movePlayer, playAITurn,} from "../utils/snakesLaddersUtils";

const NB_CASES = 100;

const SnakeLaddersGame = ({ route, navigation }) => {
  const { gameMode, userId, friendId } = route.params;

  const [player1Position, setPlayer1Position] = useState(0);
  const [player2Position, setPlayer2Position] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(gameMode === "AI");
  const [snakes, setSnakes] = useState({});
  const [ladders, setLadders] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Dice, setPlayer1Dice] = useState(0);
  const [player2Dice, setPlayer2Dice] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const [generatedSnakes, generatedLadders] = generateSnakesAndLadders();
    setSnakes(generatedSnakes);
    setLadders(generatedLadders);

    if (gameMode === "Multiplayer") {
      WebSocketService.connect(userId);

      // Listen for opponent's move
      WebSocketService.onSnakesOpponentMove((moveData) => {
        console.log("Opponent's Move Received:", moveData);
        setPlayer2Position(moveData.newPosition);
        setPlayer2Dice(moveData.diceValue);
        setIsMyTurn(true);
      });

      // Listen for game over
      WebSocketService.onSnakesGameOver((gameOverData) => {
        console.log("Game Over:", gameOverData);
        setGameOver(true);
        Alert.alert(
          "Game Over",
          gameOverData.winner === userId ? "You Win!" : "You Lose!"
        );
      });
    }
  }, [gameMode, userId]);

  const startGame = () => {
    if (gameMode === "Multiplayer") {
      WebSocketService.startSnakesGame({
        senderId: userId,
        receiverId: friendId,
      });
    }
    setGameStarted(true);
  };

  const rollDiceAndMove = () => {
    if (!isMyTurn || gameOver) return;

    const rolledValue = getDiceValue();
    setPlayer1Dice(rolledValue);
    Alert.alert("Dice Rolled", `You rolled a ${rolledValue}!`);

    let newPosition = movePlayer(player1Position, rolledValue, snakes, ladders);
    setPlayer1Position(newPosition);
    setIsMyTurn(false);

    // Multiplayer: Send the move to opponent
    if (gameMode === "Multiplayer") {
      WebSocketService.sendSnakesMove({
        player: 1,
        newPosition,
        diceValue: rolledValue,
        senderId: userId,
        receiverId: friendId,
      });
    }

    // Check for win condition
    if (newPosition >= NB_CASES) {
      Alert.alert("Victory!", "You have won the game!");
      setGameOver(true);

      if (gameMode === "Multiplayer") {
        WebSocketService.sendSnakesGameOver({ winner: userId });
      }
    }

    // AI Mode: Trigger AI's turn
    if (gameMode === "AI" && !gameOver) {
      setTimeout(() => {
        const aiRolledValue = getDiceValue();
        setPlayer2Dice(aiRolledValue);

        let aiNewPosition = playAITurn(player2Position, snakes, ladders);
        setPlayer2Position(aiNewPosition);

        // Check for AI win condition
        if (aiNewPosition >= NB_CASES) {
          setGameOver(true);
          Alert.alert("Game Over", "AI Wins!");
        } else {
          setIsMyTurn(true);
        }
      }, 1000);
    }
  };

  const restartGame = () => {
    setPlayer1Position(0);
    setPlayer2Position(0);
    setPlayer1Dice(0);
    setPlayer2Dice(0);
    setGameOver(false);
    setIsMyTurn(gameMode === "AI");
  };

  const goToGameSelection = () => {
    navigation.navigate("GameSelection");
  };

  // Render Game Board Map
  const renderGameBoard = () => {
    let board = [];

    for (let row = 9; row >= 0; row--) {
      let rowTiles = [];

      for (let col = 0; col < 10; col++) {
        let position = row * 10 + col + 1;

        // Reverse order for even rows to create zigzag pattern
        if (row % 2 === 1) {
          position = row * 10 + (9 - col) + 1;
        }

        let tileContent = position;

        if (player1Position === position) {
          tileContent = "🔴";
        }

        if (player2Position === position) {
          tileContent = "🔵";
        }

        if (snakes[position]) {
          tileContent = "🐍";
        } else if (ladders[position]) {
          tileContent = "🪜";
        }

        rowTiles.push(
          <View key={col} style={styles.cell}>
            <Text style={styles.cellText}>{tileContent}</Text>
          </View>
        );
      }

      board.push(
        <View key={row} style={styles.row}>
          {rowTiles}
        </View>
      );
    }

    return board;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snake & Ladders Game</Text>

      <Text style={styles.diceText}>
        🔴 Your Dice: {player1Dice} | 🔵 Opponent's Dice: {player2Dice}
      </Text>

      {!gameStarted && (
        <TouchableOpacity style={styles.diceButton} onPress={startGame}>
          <Text style={styles.diceButtonText}>Start Game</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.diceButton, (gameOver || !isMyTurn) && styles.diceButtonDisabled]}
        onPress={rollDiceAndMove}
        disabled={gameOver || !isMyTurn}
      >
        <Text style={styles.diceButtonText}>Roll Dice</Text>
      </TouchableOpacity>

      <View style={styles.boardContainer}>{renderGameBoard()}</View>

      {gameOver && (
        <View style={styles.gameOverButtons}>
          <TouchableOpacity style={styles.diceButton} onPress={restartGame}>
            <Text style={styles.diceButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.diceButton} onPress={goToGameSelection}>
            <Text style={styles.diceButtonText}>Play Another Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", marginTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  diceText: { fontSize: 20, marginVertical: 10 },
  diceButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  diceButtonText: { color: "#FFF", fontSize: 16 },
  diceButtonDisabled: { backgroundColor: "#9E9E9E" },
  boardContainer: { flexDirection: "column", alignItems: "center", marginTop: 20 },
  row: { flexDirection: "row" },
  cell: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: { fontSize: 12 },
  gameOverButtons: { flexDirection: "row", marginTop: 20 },
});

export default SnakeLaddersGame;
