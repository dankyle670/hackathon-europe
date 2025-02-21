// src/components/GameBoard.js
import React from "react";
import CheckerBoard from "./CheckerBoard";
import SnakeLaddersBoard from "./SnakeLaddersBoard";

const GameBoard = ({ gameMode, userId, opponentId }) => {
  return (
    <>
      {gameMode === "checkers" && (
        <CheckerBoard userId={userId} opponentId={opponentId} />
      )}
      {gameMode === "snakes-ladders" && (
        <SnakeLaddersBoard userId={userId} opponentId={opponentId} />
      )}
    </>
  );
};

export default GameBoard;
