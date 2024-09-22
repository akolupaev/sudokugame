// app.js

let originalBoard = [];
let userBoard = [];
let selectedCell = null;

document.addEventListener('DOMContentLoaded', () => {
    const newGameBtn = document.getElementById('new-game-btn');
    const difficultyPopup = document.getElementById('difficulty-popup');
    const numberPopup = document.getElementById('number-popup');
    const sudokuGrid = document.getElementById('sudoku-grid');

    // Event listener for New Game button
    newGameBtn.addEventListener('click', () => {
        difficultyPopup.classList.remove('hidden');
    });

    // Event listeners for difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            startNewGame(difficulty);
            difficultyPopup.classList.add('hidden');
        });
    });

    // Generate number selection buttons
    for (let i = 1; i <= 9; i++) {
        const numBtn = document.createElement('button');
        numBtn.textContent = i;
        numBtn.addEventListener('click', () => {
            placeNumber(i);
            numberPopup.classList.add('hidden');
        });
        numberPopup.appendChild(numBtn);
    }

    // Event listener for clicking outside popup to close it
    window.addEventListener('click', (e) => {
        if (e.target === numberPopup) {
            numberPopup.classList.add('hidden');
        }
    });

    // Function to start a new game
    function startNewGame(difficulty) {
        const removalPercentages = {
            easy: 50,
            medium: 60,
            hard: 70
        };

        const removalPercentage = removalPercentages[difficulty];

        // Generate complete board and puzzle
        originalBoard = generateCompleteBoard();
        userBoard = generatePuzzle(originalBoard, removalPercentage);

        renderBoard();
    }

    // Function to render the board
    function renderBoard() {
        sudokuGrid.innerHTML = '';

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cellValue = userBoard[row][col];
                const cell = document.createElement('div');
                cell.classList.add('cell');

                if (cellValue !== 0) {
                    cell.textContent = cellValue;
                } else {
                    cell.addEventListener('click', () => {
                        if (selectedCell) {
                            selectedCell.classList.remove('selected');
                        }
                        selectedCell = cell;
                        cell.classList.add('selected');
                        numberPopup.classList.remove('hidden');
                    });
                    displaySuggestions(cell, row, col);
                }

                sudokuGrid.appendChild(cell);
            }
        }
    }

    // Function to place a number in the selected cell
    function placeNumber(number) {
        if (!selectedCell) return;

        const index = Array.from(sudokuGrid.children).indexOf(selectedCell);
        const row = Math.floor(index / 9);
        const col = index % 9;

        userBoard[row][col] = number;
        selectedCell.textContent = number;
        selectedCell.classList.remove('selected');

        validateBoard();
        selectedCell = null;
    }

    // Function to validate the board
    function validateBoard() {
        const cells = sudokuGrid.children;

        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            cell.classList.remove('invalid');
            const row = Math.floor(index / 9);
            const col = index % 9;
            const value = userBoard[row][col];

            if (value !== 0 && !isValidPlacement(userBoard, row, col, value)) {
                cell.classList.add('invalid');
            }
        }
    }

    // Function to check if placement is valid
    function isValidPlacement(board, row, col, num) {
        // Check row and column
        for (let i = 0; i < 9; i++) {
            if ((board[row][i] === num && i !== col) ||
                (board[i][col] === num && i !== row)) {
                return false;
            }
        }

        // Check 3x3 grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num && (i !== row || j !== col)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Function to display suggestions in a cell
    function displaySuggestions(cell, row, col) {
        const possibleNumbers = [];

        for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(userBoard, row, col, num)) {
                possibleNumbers.push(num);
            }
        }

        if (possibleNumbers.length <= 3 && possibleNumbers.length > 0) {
            const suggestions = document.createElement('div');
            suggestions.classList.add('suggestions');
            suggestions.textContent = possibleNumbers.join(', ');
            cell.appendChild(suggestions);
        }
    }
});
