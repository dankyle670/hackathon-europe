import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const BOARD_SIZE = 8;
const EMPTY = null;
const PLAYER_PIECE = "P";
const AI_PIECE = "AI";

const CheckerBoard = ({ gameMode }) => {
  const [board, setBoard] = useState(initializeBoard());
  const [playerTurn, setPlayerTurn] = useState(true);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!playerTurn && gameMode === "AI" && !gameOver) {
      setTimeout(() => aiMove(), 1000);
    }
  }, [playerTurn, gameOver]);

  function initializeBoard() {
    let newBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(EMPTY));

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) newBoard[row][col] = AI_PIECE;
          if (row > 4) newBoard[row][col] = PLAYER_PIECE;
        }
      }
    }
    return newBoard;
  }

  function selectPiece(row, col) {
    if (!playerTurn || gameOver) return;

    if (board[row][col] === PLAYER_PIECE) {
      setSelectedPiece({ row, col });
      setValidMoves(getValidMoves(row, col));
    } else {
      setSelectedPiece(null);
      setValidMoves([]);
    }
  }

  function getValidMoves(row, col) {
    let moves = [];
    let jumpMoves = [];
    let directions = [
      { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
      { dr: -2, dc: -2 }, { dr: -2, dc: 2 }
    ];

    directions.forEach(({ dr, dc }) => {
      let newRow = row + dr;
      let newCol = col + dc;
      let jumpRow = row + dr / 2;
      let jumpCol = col + dc / 2;

      if (isValidMove(newRow, newCol)) {
        moves.push({ row: newRow, col: newCol });
      }

      if (
        isValidJump(row, col, newRow, newCol, jumpRow, jumpCol, AI_PIECE)
      ) {
        jumpMoves.push({
          row: newRow,
          col: newCol,
          captured: { row: jumpRow, col: jumpCol }
        });
      }
    });

    return jumpMoves.length > 0 ? jumpMoves : moves;
  }

  function movePiece(targetRow, targetCol) {
    if (!selectedPiece) return;

    let move = validMoves.find(m => m.row === targetRow && m.col === targetCol);
    if (!move) return;

    let newBoard = board.map(row => [...row]);
    let { row, col } = selectedPiece;
    newBoard[row][col] = EMPTY;
    newBoard[targetRow][targetCol] = PLAYER_PIECE;

    if (move.captured) {
      let { row: capRow, col: capCol } = move.captured;
      newBoard[capRow][capCol] = EMPTY;
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    if (!canCaptureAgain(targetRow, targetCol)) {
      setPlayerTurn(false);
    } else {
      setSelectedPiece({ row: targetRow, col: targetCol });
      setValidMoves(getValidMoves(targetRow, targetCol));
    }

    checkWinCondition(newBoard);
  }

  function isValidJump(row, col, newRow, newCol, jumpRow, jumpCol, opponentPiece) {
    return (
      isValidMove(newRow, newCol, true) &&
      board[jumpRow]?.[jumpCol] === opponentPiece &&
      board[newRow]?.[newCol] === EMPTY
    );
  }

  function canCaptureAgain(row, col) {
    let jumpMoves = getValidMoves(row, col).filter(move => move.captured);
    return jumpMoves.length > 0;
  }

  function aiMove() {
    if (gameOver) return;

    let availableMoves = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === AI_PIECE) {
          let validMoves = getValidMovesForAI(row, col);

          validMoves.forEach(move =>
            availableMoves.push({ from: { row, col }, to: move })
          );
        }
      }
    }

    if (availableMoves.length > 0) {
      let bestMove = availableMoves.find(move => move.to.captured) ||
                     availableMoves[Math.floor(Math.random() * availableMoves.length)];

      let newBoard = board.map(row => [...row]);
      newBoard[bestMove.from.row][bestMove.from.col] = EMPTY;
      newBoard[bestMove.to.row][bestMove.to.col] = AI_PIECE;

      if (bestMove.to.captured) {
        let { row: capRow, col: capCol } = bestMove.to.captured;
        newBoard[capRow][capCol] = EMPTY;
      }

      setBoard(newBoard);
      checkWinCondition(newBoard);
    }

    setPlayerTurn(true);
  }

  function getValidMovesForAI(row, col) {
    let moves = [];
    let jumpMoves = [];
    let directions = [
      { dr: 1, dc: -1 }, { dr: 1, dc: 1 },
      { dr: 2, dc: -2 }, { dr: 2, dc: 2 }
    ];

    directions.forEach(({ dr, dc }) => {
      let newRow = row + dr;
      let newCol = col + dc;
      let jumpRow = row + dr / 2;
      let jumpCol = col + dc / 2;

      if (isValidMove(newRow, newCol)) {
        moves.push({ row: newRow, col: newCol });
      }

      if (
        isValidJump(row, col, newRow, newCol, jumpRow, jumpCol, PLAYER_PIECE)
      ) {
        jumpMoves.push({
          row: newRow,
          col: newCol,
          captured: { row: jumpRow, col: jumpCol }
        });
      }
    });

    return jumpMoves.length > 0 ? jumpMoves : moves;
  }

  function checkWinCondition(newBoard) {
    let playerPieces = 0;
    let aiPieces = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === PLAYER_PIECE) playerPieces++;
        if (newBoard[row][col] === AI_PIECE) aiPieces++;
      }
    }

    if (playerPieces === 0) {
      setGameOver(true);
      Alert.alert("Game Over", "AI Wins!");
    } else if (aiPieces === 0) {
      setGameOver(true);
      Alert.alert("Game Over", "You Win!");
    }
  }

  function isValidMove(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === EMPTY;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.turnText}>
        {gameOver ? "Game Over" : playerTurn ? "Your Turn" : "AI Thinking..."}
      </Text>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.cell,
                (rowIndex + colIndex) % 2 === 0
                  ? styles.lightCell
                  : styles.darkCell,
                selectedPiece?.row === rowIndex &&
                  selectedPiece?.col === colIndex &&
                  styles.selectedPiece,
                validMoves.some(
                  (move) => move.row === rowIndex && move.col === colIndex
                ) && styles.validMove,
              ]}
              onPress={() =>
                board[rowIndex][colIndex] === PLAYER_PIECE
                  ? selectPiece(rowIndex, colIndex)
                  : movePiece(rowIndex, colIndex)
              }
            >
              {cell === PLAYER_PIECE && <View style={styles.playerPiece} />}
              {cell === AI_PIECE && <View style={styles.aiPiece} />}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 20 },
  turnText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row" },
  cell: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  lightCell: { backgroundColor: "#F0D9B5" },
  darkCell: { backgroundColor: "#B58863" },
  selectedPiece: { backgroundColor: "rgba(255, 255, 0, 0.5)" },
  validMove: { backgroundColor: "rgba(0, 255, 0, 0.5)" },
  playerPiece: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#FF0000" },
  aiPiece: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#0000FF" },
});

export default CheckerBoard;
