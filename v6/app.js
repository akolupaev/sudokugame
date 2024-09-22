let initialBoard = [];
let currentBoard = [];
let hintMode = false;

document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudoku-grid');
    const newGameBtn = document.getElementById('new-game-btn');
    const hintBtn = document.getElementById('hint-btn');
    const numpadPopup = document.getElementById('numpad-popup');
    const newGamePopup = document.getElementById('new-game-popup');
    let selectedCell = null;

    // Initialize the grid
    function initGrid() {
        sudokuGrid.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            sudokuGrid.appendChild(cell);
        }
    }

    // Render the board
    function renderBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            let index = cell.getAttribute('data-index');
            let row = Math.floor(index / 9);
            let col = index % 9;
            cell.innerHTML = '';
            cell.classList.remove('initial', 'invalid', 'valid', 'hint');

            if (initialBoard[row][col] !== 0) {
                let input = document.createElement('input');
                input.value = initialBoard[row][col];
                input.disabled = true;
                input.classList.add('initial');
                cell.appendChild(input);
            } else if (currentBoard[row][col] !== 0) {
                let input = document.createElement('input');
                input.value = currentBoard[row][col];
                input.disabled = true;
                cell.appendChild(input);
                if (isValidPlacement(currentBoard, row, col, currentBoard[row][col])) {
                    input.classList.add('valid');
                } else {
                    input.classList.add('invalid');
                }
            } else if (hintMode) {
                let possibilities = getPossibilities(currentBoard, row, col);
                if (possibilities.length <= 3) {
                    cell.classList.add('hint');
                    let hintText = document.createElement('span');
                    hintText.textContent = possibilities.join(',');
                    cell.appendChild(hintText);
                }
            }

            if (initialBoard[row][col] === 0) {
                cell.addEventListener('click', () => {
                    selectedCell = cell;
                    openNumpad();
                });
            }
        });
    }

    // Check if the number placement is valid
    function isValidPlacement(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if ((board[row][x] === num && x !== col) ||
                (board[x][col] === num && x !== row) ||
                (board[3 * Math.floor(row / 3) + Math.floor(x / 3)]
                     [3 * Math.floor(col / 3) + x % 3] === num &&
                 (3 * Math.floor(row / 3) + Math.floor(x / 3) !== row ||
                  3 * Math.floor(col / 3) + x % 3 !== col))) {
                return false;
            }
        }
        return true;
    }

    // Get possible numbers for a cell
    function getPossibilities(board, row, col) {
        let possibilities = [];
        for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
                possibilities.push(num);
            }
        }
        return possibilities;
    }

    // Open numpad popup
    function openNumpad() {
        numpadPopup.classList.remove('hidden');
        const numpad = numpadPopup.querySelector('.numpad');
        numpad.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            let btn = document.createElement('button');
            btn.textContent = i;
            btn.addEventListener('click', () => {
                placeNumber(i);
                closeNumpad();
            });
            numpad.appendChild(btn);
        }
        // Add a button to clear the cell
        let clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => {
            placeNumber(0);
            closeNumpad();
        });
        numpad.appendChild(clearBtn);
    }

    // Close numpad popup
    function closeNumpad() {
        numpadPopup.classList.add('hidden');
    }

    // Place number in selected cell
    function placeNumber(num) {
        if (selectedCell) {
            let index = selectedCell.getAttribute('data-index');
            let row = Math.floor(index / 9);
            let col = index % 9;
            currentBoard[row][col] = num;
            renderBoard();
        }
    }

    // Open new game popup
    function openNewGamePopup() {
        newGamePopup.classList.remove('hidden');
    }

    // Close new game popup
    function closeNewGamePopup() {
        newGamePopup.classList.add('hidden');
    }

    // Start new game
    function startNewGame(difficulty) {
        initialBoard = generateSudoku(difficulty);
        currentBoard = initialBoard.map(arr => arr.slice());
        renderBoard();
        closeNewGamePopup();
    }

    // Toggle hint mode
    function toggleHintMode() {
        hintMode = !hintMode;
        hintBtn.classList.toggle('active');
        renderBoard();
    }

    // Event listeners
    newGameBtn.addEventListener('click', openNewGamePopup);
    hintBtn.addEventListener('click', toggleHintMode);

    document.getElementById('close-numpad').addEventListener('click', closeNumpad);

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let difficulty = btn.getAttribute('data-difficulty');
            startNewGame(difficulty);
        });
    });

    // Initialize the game
    initGrid();
    openNewGamePopup();
});
