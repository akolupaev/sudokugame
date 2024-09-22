let currentGrid = [];
let activeCell = null;

// Initialize the game
document.getElementById('new-game-btn').addEventListener('click', () => {
    document.getElementById('difficulty-popup').classList.remove('hidden');
});

document.getElementById('easy-btn').addEventListener('click', () => startNewGame('easy'));
document.getElementById('medium-btn').addEventListener('click', () => startNewGame('medium'));
document.getElementById('hard-btn').addEventListener('click', () => startNewGame('hard'));

function startNewGame(difficulty) {
    currentGrid = generateSudoku(difficulty);
    renderGrid(currentGrid);
    document.getElementById('difficulty-popup').classList.add('hidden');
}

// Handle cell click to bring up numpad
function handleCellClick(row, col) {
    activeCell = { row, col };
    document.getElementById('numpad-popup').classList.remove('hidden');
    renderNumpad(row, col);
}

// Render the numpad for user input
function renderNumpad(row, col) {
    const numpad = document.getElementById('numpad');
    numpad.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = !isValidNumber(i, row, col);
        button.addEventListener('click', () => selectNumber(i, row, col));
        numpad.appendChild(button);
    }
}

// Check if a number is valid in the given cell
function isValidNumber(num, row, col) {
    for (let i = 0; i < 9; i++) {
        if (currentGrid[row][i] === num || currentGrid[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (currentGrid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

// Handle number selection
function selectNumber(num, row, col) {
    currentGrid[row][col] = num;
    renderGrid(currentGrid);
    document.getElementById('numpad-popup').classList.add('hidden');
    validateGrid();
}

// Validate the Sudoku grid
function validateGrid() {
    const cells = document.querySelectorAll('#sudoku-grid td');
    cells.forEach(cell => cell.classList.remove('invalid'));
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentGrid[i][j] !== 0 && !isValidNumber(currentGrid[i][j], i, j)) {
                document.querySelector(`#sudoku-grid tr:nth-child(${i + 1}) td:nth-child(${j + 1})`).classList.add('invalid');
            }
        }
    }
}
