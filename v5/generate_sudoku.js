// generate_sudoku.js

/**
 * Generates a complete, valid Sudoku board using backtracking.
 * @returns {number[][]} A 9x9 matrix representing a complete Sudoku board.
 */
function generateCompleteBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(board);
    return board;
}

/**
 * Solves the Sudoku board using backtracking algorithm.
 * @param {number[][]} board - The Sudoku board to solve.
 * @returns {boolean} True if the board is solvable, else false.
 */
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

/**
 * Checks if it's safe to place a number in a given cell.
 * @param {number[][]} board - The Sudoku board.
 * @param {number} row - Row index.
 * @param {number} col - Column index.
 * @param {number} num - Number to place.
 * @returns {boolean} True if safe, else false.
 */
function isSafe(board, row, col, num) {
    // Check row and column
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }
    // Check 3x3 grid
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Shuffles an array in place.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Removes numbers from the complete board based on difficulty.
 * Ensures the puzzle remains solvable with a unique solution.
 * @param {number[][]} board - The complete Sudoku board.
 * @param {string} difficulty - 'easy', 'medium', or 'hard'.
 * @returns {number[][]} The puzzle board with numbers removed.
 */
function removeNumbers(board, difficulty) {
    const boardCopy = board.map(row => row.slice());
    let cellsToRemove;
    switch (difficulty) {
        case 'easy':
            cellsToRemove = 81 * 0.5;
            break;
        case 'medium':
            cellsToRemove = 81 * 0.6;
            break;
        case 'hard':
            cellsToRemove = 81 * 0.7;
            break;
        default:
            cellsToRemove = 81 * 0.5;
    }
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (boardCopy[row][col] !== 0) {
            const backup = boardCopy[row][col];
            boardCopy[row][col] = 0;

            // Check if the puzzle still has a unique solution
            const solutions = [];
            solveSudokuMultipleSolutions(boardCopy.map(row => row.slice()), solutions);
            if (solutions.length !== 1) {
                boardCopy[row][col] = backup; // Restore if not unique
            } else {
                cellsToRemove--;
            }
        }
    }
    return boardCopy;
}

/**
 * Solves the Sudoku and collects all possible solutions.
 * @param {number[][]} board - The Sudoku board.
 * @param {Array} solutions - Array to collect solutions.
 * @returns {boolean} True if a solution is found.
 */
function solveSudokuMultipleSolutions(board, solutions) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudokuMultipleSolutions(board, solutions)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    solutions.push(board.map(row => row.slice()));
    return solutions.length >= 2 ? true : false;
}
