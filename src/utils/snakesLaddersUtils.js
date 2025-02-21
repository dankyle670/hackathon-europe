// src/utils/snakesLaddersUtils.js

const NB_CASES = 100;
const DICE_FACE = 6;

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getDiceValue = () => {
  return randomInt(1, DICE_FACE);
};

export const generateSnakesAndLadders = () => {
  const snakes = {};
  const ladders = {};

  // Generate Snakes
  for (let i = 0; i < 10; i++) {
    let start = randomInt(2, NB_CASES - 1);
    let end = randomInt(1, start - 1);
    snakes[start] = end;
  }

  // Generate Ladders
  for (let i = 0; i < 9; i++) {
    let start = randomInt(1, NB_CASES - 2);
    let end = randomInt(start + 1, NB_CASES);
    ladders[start] = end;
  }

  return [snakes, ladders];
};

export const movePlayer = (position, diceValue, snakes, ladders) => {
  let newPosition = position + diceValue;

  if (newPosition in snakes) {
    newPosition = snakes[newPosition];
  } else if (newPosition in ladders) {
    newPosition = ladders[newPosition];
  }

  // Ensure player doesn't go beyond the last square
  return newPosition > NB_CASES ? NB_CASES : newPosition;
};

// AI Logic to play its turn
export const playAITurn = (aiPosition, snakes, ladders) => {
  const diceValue = getDiceValue();
  console.log("🎲 AI Rolled:", diceValue);
  let newPosition = movePlayer(aiPosition, diceValue, snakes, ladders);
  console.log("🤖 AI Moved To:", newPosition);
  return newPosition;
};
