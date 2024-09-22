// generate_sudoku.js

/**
 * Generates a complete, valid Sudoku board using backtracking.
 * @returns {number[][]} A 9x9 Sudoku board.
 */
function generateFullBoard() {
    let board = [];
    for(let i = 0; i < 9; i++) {
        board.push([0,0,0,0,0,0,0,0,0]);
    }
    fillBoard(board);
    return board;
}

/**
 * Recursively fills the Sudoku board with valid numbers.
 * @param {number[][]} board - The Sudoku board.
 * @returns {boolean} True if the board is successfully filled.
 */
function fillBoard(board) {
    let empty = findEmpty(board);
    if (!empty) {
        return true; // Board is fully filled
    }
    let row = empty[0];
    let col = empty[1];

    let numbers = [1,2,3,4,5,6,7,8,9];
    shuffleArray(numbers); // Randomize number order

    for (let num of numbers) {
        if (isValid(board, num, row, col)) {
            board[row][col] = num;

            if (fillBoard(board)) {
                return true;
            }

            board[row][col] = 0; // Reset cell
        }
    }
    return false; // Trigger backtracking
}

/**
 * Finds an empty cell in the Sudoku board.
 * @param {number[][]} board - The Sudoku board.
 * @returns {number[] | null} The [row, col] of an empty cell or null if none.
 */
function findEmpty(board) {
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
 * Checks if placing a number at a given position is valid.
 * @param {number[][]} board - The Sudoku board.
 * @param {number} num - The number to place.
 * @param {number} row - The row index.
 * @param {number} col - The column index.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValid(board, num, row, col) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num && i !== col) {
            return false;
        }
    }
    // Check column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num && i !== row) {
            return false;
        }
    }
    // Check 3x3 square
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
            if (board[i][j] === num && (i !== row || j !== col)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 * @param {any[]} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Removes numbers from the full board to create a puzzle with a unique solution.
 * @param {number[][]} board - The complete Sudoku board.
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard').
 * @returns {number[][]} The puzzle board with numbers removed.
 */
function createPuzzle(board, difficulty) {
    let totalCells = 81;
    let cellsToRemove;
    switch(difficulty) {
        case 'easy':
            cellsToRemove = Math.floor(0.5 * totalCells); // 50%
            break;
        case 'medium':
            cellsToRemove = Math.floor(0.6 * totalCells); // 60%
            break;
        case 'hard':
            cellsToRemove = Math.floor(0.7 * totalCells); // 70%
            break;
        default:
            cellsToRemove = Math.floor(0.5 * totalCells);
    }

    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            let backup = board[row][col];
            board[row][col] = 0;

            let boardCopy = board.map(function(arr) {
                return arr.slice();
            });

            let solutions = countSolutions(boardCopy);

            if (solutions !== 1) {
                board[row][col] = backup;
                continue;
            }
            cellsToRemove--;
        }
    }
    return board;
}

/**
 * Counts the number of solutions for a given Sudoku board.
 * @param {number[][]} board - The Sudoku board.
 * @returns {number} The number of solutions.
 */
function countSolutions(board) {
    let empty = findEmpty(board);
    if (!empty) {
        return 1; // Found a solution
    }
    let row = empty[0];
    let col = empty[1];
    let count = 0;

    for (let num = 1; num <=9; num++) {
        if (isValid(board, num, row, col)) {
            board[row][col] = num;
            count += countSolutions(board);
            if (count > 1) {
                break; // More than one solution found
            }
            board[row][col] = 0;
        }
    }
    return count;
}

// Expose functions to global scope
window.generateFullBoard = generateFullBoard;
window.createPuzzle = createPuzzle;
