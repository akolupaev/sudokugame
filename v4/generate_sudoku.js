// generate_sudoku.js

/**
 * Generates a complete, valid Sudoku board using backtracking.
 * @returns {number[][]} A 9x9 matrix representing the Sudoku board.
 */
function generateCompleteBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
}

/**
 * Fills the board using backtracking algorithm.
 * @param {number[][]} board - The Sudoku board.
 * @returns {boolean} True if the board is successfully filled.
 */
function fillBoard(board) {
    const emptyPos = findEmpty(board);
    if (!emptyPos) return true; // Board is complete

    const [row, col] = emptyPos;
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let num of numbers) {
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

/**
 * Finds an empty cell in the board.
 * @param {number[][]} board - The Sudoku board.
 * @returns {number[] | null} The position [row, col] or null if no empty cell.
 */
function findEmpty(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i, j];
        }
    }
    return null;
}

/**
 * Checks if placing a number is valid.
 * @param {number[][]} board - The Sudoku board.
 * @param {number} row - Row index.
 * @param {number} col - Column index.
 * @param {number} num - Number to place.
 * @returns {boolean} True if valid move.
 */
function isValidMove(board, row, col, num) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) return false;
        }
    }
    return true;
}

/**
 * Shuffles an array in place.
 * @param {any[]} array - The array to shuffle.
 * @returns {any[]} The shuffled array.
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
 * Ensures the puzzle has a unique solution.
 * @param {number[][]} board - The complete Sudoku board.
 * @param {number} removalPercentage - Percentage of cells to remove.
 * @returns {number[][]} The puzzle board with numbers removed.
 */
function generatePuzzle(board, removalPercentage) {
    const totalCells = 81;
    const cellsToRemove = Math.floor((removalPercentage / 100) * totalCells);

    const puzzleBoard = board.map(row => row.slice());

    let attempts = 0;
    let removedCells = 0;

    while (removedCells < cellsToRemove && attempts < cellsToRemove * 5) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzleBoard[row][col] !== 0) {
            const backup = puzzleBoard[row][col];
            puzzleBoard[row][col] = 0;

            const boardCopy = puzzleBoard.map(row => row.slice());
            let solutions = 0;

            solveBoard(boardCopy, () => {
                solutions++;
                return solutions > 1; // Stop if more than one solution
            });

            if (solutions !== 1) {
                puzzleBoard[row][col] = backup; // Revert change
            } else {
                removedCells++;
            }
        }
        attempts++;
    }

    return puzzleBoard;
}

/**
 * Solves the board and counts solutions.
 * @param {number[][]} board - The Sudoku board.
 * @param {Function} shouldStop - Function to determine when to stop recursion.
 * @returns {boolean} True if solved.
 */
function solveBoard(board, shouldStop) {
    const emptyPos = findEmpty(board);
    if (!emptyPos) return true; // Board is complete

    const [row, col] = emptyPos;

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board, shouldStop)) {
                if (shouldStop()) return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}
