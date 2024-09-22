// app.js

let board = []; // The puzzle board
let selectedCell = null;

/**
 * Initializes the Sudoku grid on the page.
 */
function initGrid() {
    const gridContainer = document.getElementById('sudoku-grid');
    gridContainer.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col <9; col++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', onCellClick);
            gridContainer.appendChild(cell);
        }
    }
}

/**
 * Handles click events on cells.
 * @param {Event} event - The click event.
 */
function onCellClick(event) {
    let cell = event.target;
    if (cell.classList.contains('initial')) {
        return; // Do nothing if initial cell
    }
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }
    selectedCell = cell;
    cell.classList.add('selected');

    updateNumberPopup();
    showNumberPopup();
}

/**
 * Displays the number selection popup.
 */
function showNumberPopup() {
    const numberPopup = document.getElementById('number-popup');
    numberPopup.classList.remove('hidden');
    numberPopup.classList.add('active');
}

/**
 * Hides the number selection popup.
 */
function hideNumberPopup() {
    const numberPopup = document.getElementById('number-popup');
    numberPopup.classList.add('hidden');
    numberPopup.classList.remove('active');
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
}

/**
 * Updates the number selection popup with valid numbers.
 */
function updateNumberPopup() {
    const numberButtonsContainer = document.getElementById('number-buttons');
    numberButtonsContainer.innerHTML = '';
    let row = parseInt(selectedCell.dataset.row);
    let col = parseInt(selectedCell.dataset.col);

    for (let num = 1; num <= 9; num++) {
        let button = document.createElement('button');
        button.textContent = num;
        button.classList.add('number-button');

        if (!isValidMove(board, num, row, col)) {
            button.disabled = true;
        }

        button.addEventListener('click', function() {
            board[row][col] = num;
            selectedCell.textContent = num;
            selectedCell.classList.remove('invalid');
            validateBoard();
            hideNumberPopup();
        });

        numberButtonsContainer.appendChild(button);
    }
}

/**
 * Validates the entire board and highlights invalid entries.
 */
function validateBoard() {
    for (let row = 0; row <9; row++) {
        for (let col = 0; col <9; col++) {
            let cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (board[row][col] !== 0) {
                if (!isValidCell(board, board[row][col], row, col)) {
                    cell.classList.add('invalid');
                } else {
                    cell.classList.remove('invalid');
                }
            } else {
                cell.classList.remove('invalid');
            }
        }
    }
}

/**
 * Checks if a move is valid at the specified position.
 * @param {number[][]} board - The Sudoku board.
 * @param {number} num - The number to place.
 * @param {number} row - The row index.
 * @param {number} col - The column index.
 * @returns {boolean} True if the move is valid.
 */
function isValidMove(board, num, row, col) {
    // Temporarily place the number
    let temp = board[row][col];
    board[row][col] = num;

    // Check if valid
    let valid = isValidCell(board, num, row, col);

    // Restore original value
    board[row][col] = temp;
    return valid;
}

/**
 * Checks if placing a number at a given position is valid.
 * @param {number[][]} board - The Sudoku board.
 * @param {number} num - The number to check.
 * @param {number} row - The row index.
 * @param {number} col - The column index.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidCell(board, num, row, col) {
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
 * Starts a new game with the selected difficulty.
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard').
 */
function startNewGame(difficulty) {
    // Generate new board
    let fullBoard = generateFullBoard();
    board = createPuzzle(fullBoard, difficulty);

    // Render the board
    renderBoard();
}

/**
 * Renders the Sudoku board on the page.
 */
function renderBoard() {
    for (let row = 0; row <9; row++) {
        for (let col = 0; col <9; col++) {
            let cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.textContent = '';
            cell.classList.remove('initial');
            cell.classList.remove('invalid');

            if (board[row][col] !== 0) {
                cell.textContent = board[row][col];
                cell.classList.add('initial');
            }
        }
    }
}

// Event listeners

// Show difficulty selection popup
document.getElementById('new-game-button').addEventListener('click', function() {
    const difficultyPopup = document.getElementById('difficulty-popup');
    difficultyPopup.classList.remove('hidden');
    difficultyPopup.classList.add('active');
});

// Handle difficulty selection
document.querySelectorAll('.difficulty-button').forEach(function(button) {
    button.addEventListener('click', function() {
        let difficulty = button.dataset.difficulty;
        startNewGame(difficulty);
        const difficultyPopup = document.getElementById('difficulty-popup');
        difficultyPopup.classList.add('hidden');
        difficultyPopup.classList.remove('active');
    });
});

// Close number popup when clicking outside
window.addEventListener('click', function(event) {
    const numberPopup = document.getElementById('number-popup');
    if (numberPopup.classList.contains('active') && !numberPopup.contains(event.target) && !event.target.classList.contains('cell')) {
        hideNumberPopup();
    }
});

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', function() {
    initGrid();
});
