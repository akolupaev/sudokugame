class SudokuApp {
    constructor() {
        this.generator = new SudokuGenerator();
        this.grid = [];
        this.initialGrid = [];
        this.hintMode = false;
        this.selectedCell = null;

        this.initializeDOM();
        this.attachEventListeners();
    }

    initializeDOM() {
        this.sudokuGrid = document.getElementById('sudoku-grid');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.difficultyPopup = document.getElementById('difficulty-popup');
        this.numpadPopup = document.getElementById('numpad-popup');
    }

    attachEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.showDifficultyPopup());
        this.hintBtn.addEventListener('click', () => this.toggleHintMode());
        this.difficultyPopup.addEventListener('click', (e) => this.handleDifficultySelection(e));
        this.numpadPopup.addEventListener('click', (e) => this.handleNumpadInput(e));
        window.addEventListener('resize', () => this.updateGridSize());
    }

    showDifficultyPopup() {
        this.difficultyPopup.style.display = 'block';
    }

    handleDifficultySelection(e) {
        if (e.target.classList.contains('difficulty-btn')) {
            const difficulty = e.target.dataset.difficulty;
            this.startNewGame(difficulty);
            this.difficultyPopup.style.display = 'none';
        }
    }

    startNewGame(difficulty) {
        this.grid = this.generator.generate(difficulty);
        this.initialGrid = this.grid.map(row => [...row]);
        this.renderGrid();
        this.updateGridSize();
    }

    renderGrid() {
        this.sudokuGrid.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (this.initialGrid[i][j] !== 0) {
                    cell.textContent = this.initialGrid[i][j];
                    cell.classList.add('initial');
                } else {
                    cell.addEventListener('click', (e) => this.handleCellClick(e));
                }

                this.sudokuGrid.appendChild(cell);
            }
        }
        this.updateAllCells();
    }

    updateGridSize() {
        const gridSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
        document.documentElement.style.setProperty('--grid-size', `${gridSize}px`);
    }

    handleCellClick(e) {
        const cell = e.target;
        if (cell.classList.contains('initial')) return;
        
        this.selectedCell = cell;
        const rect = cell.getBoundingClientRect();
        this.numpadPopup.style.display = 'block';
        this.numpadPopup.style.left = `${rect.left}px`;
        this.numpadPopup.style.top = `${rect.bottom}px`;
    }

    handleNumpadInput(e) {
        if (e.target.classList.contains('numpad-btn')) {
            const value = e.target.textContent;
            if (value === 'Clear') {
                this.updateCell(0);
            } else {
                this.updateCell(parseInt(value));
            }
            this.numpadPopup.style.display = 'none';
        }
    }

    updateCell(value) {
        if (!this.selectedCell) return;

        const row = parseInt(this.selectedCell.dataset.row);
        const col = parseInt(this.selectedCell.dataset.col);

        this.grid[row][col] = value;
        this.selectedCell.textContent = value === 0 ? '' : value;
        this.selectedCell.classList.remove('invalid');

        if (value !== 0 && !this.isValidMove(row, col, value)) {
            this.selectedCell.classList.add('invalid');
        }

        this.updateAllCells();
    }

    isValidMove(row, col, value) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (i !== col && this.grid[row][i] === value) return false;
        }

        // Check column
        for (let i = 0; i < 9; i++) {
            if (i !== row && this.grid[i][col] === value) return false;
        }

        // Check 3x3 sub-grid
        const subGridRow = Math.floor(row / 3) * 3;
        const subGridCol = Math.floor(col / 3) * 3;
        for (let i = subGridRow; i < subGridRow + 3; i++) {
            for (let j = subGridCol; j < subGridCol + 3; j++) {
                if (i !== row && j !== col && this.grid[i][j] === value) return false;
            }
        }

        return true;
    }

    toggleHintMode() {
        this.hintMode = !this.hintMode;
        this.hintBtn.textContent = this.hintMode ? 'Turn Off Hints' : 'Turn On Hints';
        this.updateAllCells();
    }

    updateAllCells() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = this.sudokuGrid.children[i * 9 + j];
                const value = this.grid[i][j];

                if (this.initialGrid[i][j] !== 0) {
                    cell.textContent = value;
                    cell.classList.add('initial');
                } else {
                    cell.textContent = value === 0 ? '' : value;
                    cell.classList.remove('initial');
                    
                    if (value !== 0 && !this.isValidMove(i, j, value)) {
                        cell.classList.add('invalid');
                    } else {
                        cell.classList.remove('invalid');
                    }

                    if (this.hintMode && value === 0) {
                        const hints = this.getHints(i, j);
                        if (hints.length <= 3) {
                            cell.innerHTML = `<span class="hint">${hints.join('')}</span>`;
                        } else {
                            cell.innerHTML = '';
                        }
                    }
                }
            }
        }
    }

    getHints(row, col) {
        const hints = [];
        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(row, col, num)) {
                hints.push(num);
            }
        }
        return hints;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SudokuApp();
});