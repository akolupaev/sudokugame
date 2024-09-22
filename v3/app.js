// app.js

document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('sudoku-grid');
    const newGameBtn = document.getElementById('new-game-btn');
    const difficultyPopup = document.getElementById('difficulty-popup');
    const numberInputPopup = document.getElementById('number-input-popup');
    const closeNumberPopup = document.getElementById('close-number-popup');
    const numberOptions = document.getElementById('number-options');

    let selectedCell = null;
    let board = [];
    let initialBoard = [];

    /**
     * Generates the Sudoku grid and appends it to the DOM.
     */
    function generateGrid() {
        gridElement.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                // Add thicker borders for 3x3 grids
                if (col === 2 || col === 5) {
                    cell.classList.add('border-right');
                }
                if (col === 3) {
                    cell.classList.add('border-left');
                }
                if (row === 2 || row === 5) {
                    cell.classList.add('border-bottom');
                }
                if (row === 3) {
                    cell.classList.add('border-top');
                }
                cell.addEventListener('click', onCellClick);
                gridElement.appendChild(cell);
            }
        }
    }

    /**
     * Starts a new game with the selected difficulty.
     * @param {String} difficulty - 'easy', 'medium', or 'hard'
     */
    function startNewGame(difficulty) {
        board = generateSudoku(difficulty);
        initialBoard = JSON.parse(JSON.stringify(board));
        updateGrid();
    }

    /**
     * Updates the grid display based on the current board state.
     */
    function updateGrid() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            let row = cell.dataset.row;
            let col = cell.dataset.col;
            cell.classList.remove('selected', 'invalid', 'readonly');
            cell.innerHTML = '';
            let value = board[row][col];
            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add('readonly');
            } else {
                let possibleNumbers = getPossibleNumbers(board, row, col);
                if (possibleNumbers.length <= 3) {
                    let span = document.createElement('span');
                    span.classList.add('possible-numbers');
                    span.textContent = possibleNumbers.join(' ');
                    cell.appendChild(span);
                }
            }
        });
    }

    /**
     * Handles click events on cells.
     * @param {Event} e - The click event
     */
    function onCellClick(e) {
        if (this.classList.contains('readonly')) {
            return;
        }
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = this;
        selectedCell.classList.add('selected');
        openNumberInputPopup();
    }

    /**
     * Opens the difficulty selection popup.
     */
    newGameBtn.addEventListener('click', () => {
        difficultyPopup.style.display = 'block';
    });

    /**
     * Closes the difficulty popup and starts a new game.
     */
    let difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyPopup.style.display = 'none';
            let difficulty = button.dataset.difficulty;
            startNewGame(difficulty);
        });
    });

    /**
     * Opens the number input popup for entering numbers.
     */
    function openNumberInputPopup() {
        numberInputPopup.style.display = 'block';
        numberOptions.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            let btn = document.createElement('button');
            btn.textContent = i;
            btn.addEventListener('click', () => {
                enterNumber(i);
                closeNumberInputPopup();
            });
            numberOptions.appendChild(btn);
        }
        // Add an erase button
        let eraseBtn = document.createElement('button');
        eraseBtn.textContent = 'Erase';
        eraseBtn.addEventListener('click', () => {
            enterNumber(0);
            closeNumberInputPopup();
        });
        numberOptions.appendChild(eraseBtn);
    }

    /**
     * Closes the number input popup.
     */
    function closeNumberInputPopup() {
        numberInputPopup.style.display = 'none';
    }

    closeNumberPopup.addEventListener('click', closeNumberInputPopup);

    /**
     * Enters a number into the selected cell and validates the board.
     * @param {Number} num - The number to enter (0 to erase)
     */
    function enterNumber(num) {
        if (selectedCell) {
            let row = selectedCell.dataset.row;
            let col = selectedCell.dataset.col;
            board[row][col] = num;
            validateBoard();
            updateGrid();
        }
    }

    /**
     * Validates the entire board and highlights invalid numbers.
     */
    function validateBoard() {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('invalid');
            let row = cell.dataset.row;
            let col = cell.dataset.col;
            let num = board[row][col];
            if (num !== 0 && !isValidCell(board, num, row, col)) {
                cell.classList.add('invalid');
            }
        });
    }

    /**
     * Checks if the number at the given cell is valid (excluding the cell itself).
     * @param {Array} board - The Sudoku board
     * @param {Number} num - The number to check
     * @param {Number} row - The row index
     * @param {Number} col - The column index
     * @returns {Boolean} True if valid, False otherwise
     */
    function isValidCell(board, num, row, col) {
        for (let i = 0; i < 9; i++) {
            if (i != col && board[row][i] === num) {
                return false;
            }
            if (i != row && board[i][col] === num) {
                return false;
            }
        }
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let r = startRow + i;
                let c = startCol + j;
                if ((r != row || c != col) && board[r][c] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Retrieves possible numbers for a given cell based on Sudoku rules.
     * @param {Array} board - The Sudoku board
     * @param {Number} row - The row index
     * @param {Number} col - The column index
     * @returns {Array} Array of possible numbers
     */
    function getPossibleNumbers(board, row, col) {
        let possible = [];
        for (let num = 1; num <= 9; num++) {
            board[row][col] = 0; // Temporarily clear the cell
            if (isValidMove(board, num, row, col)) {
                possible.push(num);
            }
        }
        board[row][col] = 0; // Ensure cell is empty
        return possible;
    }

    /**
     * Handles keyboard input for entering numbers into cells.
     */
    document.addEventListener('keydown', (e) => {
        if (selectedCell && !selectedCell.classList.contains('readonly')) {
            let key = e.key;
            if (key >= '1' && key <= '9') {
                enterNumber(parseInt(key));
            } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
                enterNumber(0);
            }
        }
    });

    // Initialize the grid on page load
    generateGrid();
});
