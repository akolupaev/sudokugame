// generate_sudoku.js

/**
 * Generates a complete Sudoku board using backtracking algorithm.
 * @returns {Array} 9x9 complete Sudoku board
 */
function generateCompleteBoard() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
}

/**
 * Backtracking function to fill the board with valid numbers.
 * @param {Array} board - The Sudoku board
 * @returns {Boolean} True if the board is successfully filled
 */
function fillBoard(board) {
    let emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return true; // Board is complete
    }

    let [row, col] = emptyCell;
    let numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let num of numbers) {
        if (isValidMove(board, num, row, col)) {
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
 * Shuffles an array in random order.
 * @param {Array} array - The array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Finds an empty cell (with value 0) in the board.
 * @param {Array} board - The Sudoku board
 * @returns {Array|null} [row, col] of empty cell or null if none found
 */
function findEmptyCell(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

/**
 * Checks if placing a number at given position is valid.
 * @param {Array} board - The Sudoku board
 * @param {Number} num - The number to place
 * @param {Number} row - The row index
 * @param {Number} col - The column index
 * @returns {Boolean} True if valid, False otherwise
 */
function isValidMove(board, num, row, col) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }
    // Check 3x3 grid
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Removes numbers from the complete board based on difficulty.
 * Ensures the puzzle has a unique solution.
 * @param {Array} board - The complete Sudoku board
 * @param {String} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Array} The puzzle board with numbers removed
 */
function removeNumbers(board, difficulty) {
    let totalCells = 81;
    let removeCount;
    if (difficulty === 'easy') {
        removeCount = Math.floor(totalCells * 0.5);
    } else if (difficulty === 'medium') {
        removeCount = Math.floor(totalCells * 0.6);
    } else if (difficulty === 'hard') {
        removeCount = Math.floor(totalCells * 0.7);
    }

    let attempts = removeCount;

    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            let backup = board[row][col];
            board[row][col] = 0;

            let boardCopy = JSON.parse(JSON.stringify(board));
            let solutions = countSolutions(boardCopy);
            if (solutions !== 1) {
                board[row][col] = backup;
                attempts--;
            } else {
                attempts--;
            }
        }
    }

    return board;
}

/**
 * Counts the number of solutions for a given Sudoku board.
 * Uses backtracking to find all possible solutions.
 * @param {Array} board - The Sudoku board
 * @returns {Number} Number of solutions found
 */
function countSolutions(board) {
    let emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return 1; // One solution found
    }

    let [row, col] = emptyCell;
    let totalSolutions = 0;

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, num, row, col)) {
            board[row][col] = num;
            totalSolutions += countSolutions(board);
            if (totalSolutions > 1) {
                break; // More than one solution found
            }
            board[row][col] = 0;
        }
    }
    return totalSolutions;
}

/**
 * Generates a new Sudoku puzzle with unique solution.
 * @param {String} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Array} The generated Sudoku puzzle board
 */
function generateSudoku(difficulty) {
    let board = generateCompleteBoard();
    board = removeNumbers(board, difficulty);
    return board;
}
