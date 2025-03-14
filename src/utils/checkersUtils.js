// /Users/ousmanesacko/Desktop/HackThon/hackathon-europe/src/utils/checkersUtils.js

/**
 * Utility functions for Checkers game
 */

/**
 * Checks if a move is valid
 * @param {Array} board - The current state of the board
 * @param {Object} from - The starting position { row: number, col: number }
 * @param {Object} to - The ending position { row: number, col: number }
 * @returns {boolean} - True if the move is valid, false otherwise
 */
function isValidMove(board, from, to) {
    // Implement the logic to check if the move is valid
    // This is just a placeholder implementation
    if (board[from.row][from.col] === null || board[to.row][to.col] !== null) {
        return false;
    }
    // Add more rules for valid moves
    return true;
}

/**
 * Makes a move on the board
 * @param {Array} board - The current state of the board
 * @param {Object} from - The starting position { row: number, col: number }
 * @param {Object} to - The ending position { row: number, col: number }
 * @returns {Array} - The new state of the board
 */
function makeMove(board, from, to) {
    if (!isValidMove(board, from, to)) {
        throw new Error('Invalid move');
    }
    // Implement the logic to make the move
    // This is just a placeholder implementation
    board[to.row][to.col] = board[from.row][from.col];
    board[from.row][from.col] = null;
    return board;
}

module.exports = {
    isValidMove,
    makeMove
};