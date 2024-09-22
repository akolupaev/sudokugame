// app.js

// Global variables
let puzzle = [];
let solution = [];
let hintMode = false;

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    const newGameBtn = document.getElementById('new-game-btn');
    const hintBtn = document.getElementById('hint-btn');
    const difficultyPopup = document.getElementById('difficulty-popup');
    const numpadPopup = document.getElementById('numpad-popup');

    // Start new game button click
    newGameBtn.addEventListener('click', () => {
        difficultyPopup.classList.remove('hidden');
    });

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = button.dataset.difficulty;
            startNewGame(difficulty);
            difficultyPopup.classList.add('hidden');
        });
    });

    // Hint button click
    hintBtn.addEventListener('click', () => {
        hintMode = !hintMode;
        hintBtn.classList.toggle('active', hintMode);
        updateHints();
    });
});

/**
 * Starts a new game with the selected difficulty.
 * @param {string} difficulty - Selected difficulty level.
 */
function startNewGame(difficulty) {
    const completeBoard = generateCompleteBoard();
    solution = completeBoard.map(row => row.slice());
    puzzle = removeNumbers(completeBoard, difficulty);
    renderBoard();
}

/**
 * Renders the Sudoku grid.
 */
function renderBoard() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (puzzle[row][col] !== 0) {
                cell.textContent = puzzle[row][col];
                cell.classList.add('prefilled');
            } else {
                cell.addEventListener('click', () => openNumpad(row, col));
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            grid.appendChild(cell);
        }
    }
}

/**
 * Opens the numpad popup for number input.
 * @param {number} row - Row index of the cell.
 * @param {number} col - Column index of the cell.
 */
function openNumpad(row, col) {
    const numpadPopup = document.getElementById('numpad-popup');
    numpadPopup.classList.remove('hidden');
    document.querySelectorAll('.numpad-btn').forEach(button => {
        button.onclick = () => {
            const value = button.dataset.value;
            puzzle[row][col] = value ? parseInt(value) : 0;
            numpadPopup.classList.add('hidden');
            renderBoard();
            validateBoard();
            if (hintMode) updateHints();
        };
    });
}

/**
 * Validates the board and marks invalid cells.
 */
function validateBoard() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('invalid');
    });
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const value = puzzle[row][col];
            if (value !== 0 && !isSafe(puzzle, row, col, value)) {
                const cell = document.querySelector(
                    `.cell[data-row='${row}'][data-col='${col}']`
                );
                cell.classList.add('invalid');
            }
        }
    }
}

/**
 * Updates the hints on the board.
 */
function updateHints() {
    if (hintMode) {
        document.querySelectorAll('.cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (puzzle[row][col] === 0) {
                const possibilities = getPossibilities(puzzle, row, col);
                if (possibilities.length <= 3) {
                    cell.textContent = possibilities.join(',');
                    cell.classList.add('hint');
                } else {
                    cell.textContent = '';
                    cell.classList.remove('hint');
                }
            }
        });
    } else {
        renderBoard();
    }
}

/**
 * Gets possible numbers for a cell.
 * @param {number[][]} board - The current puzzle board.
 * @param {number} row - Row index.
 * @param {number} col - Column index.
 * @returns {number[]} An array of possible numbers.
 */
function getPossibilities(board, row, col) {
    const possibilities = [];
    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            possibilities.push(num);
        }
    }
    return possibilities;
}
