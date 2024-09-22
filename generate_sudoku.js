class SudokuGenerator {
    constructor() {
        this.grid = Array(9).fill().map(() => Array(9).fill(0));
    }

    generate(difficulty) {
        this.fillGrid(0, 0);
        this.removeNumbers(difficulty);
        return this.grid;
    }

    fillGrid(row, col) {
        if (col === 9) {
            row++;
            col = 0;
            if (row === 9) return true;
        }

        if (this.grid[row][col] !== 0) return this.fillGrid(row, col + 1);

        const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
            if (this.isValid(row, col, num)) {
                this.grid[row][col] = num;
                if (this.fillGrid(row, col + 1)) return true;
                this.grid[row][col] = 0;
            }
        }

        return false;
    }

    isValid(row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (this.grid[row][x] === num || this.grid[x][col] === num) return false;
        }

        let boxRow = Math.floor(row / 3) * 3;
        let boxCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    removeNumbers(difficulty) {
        let cellsToRemove;
        switch (difficulty) {
            case 'easy':
                cellsToRemove = 40; // 50% of 81
                break;
            case 'medium':
                cellsToRemove = 49; // 60% of 81
                break;
            case 'hard':
                cellsToRemove = 57; // 70% of 81
                break;
            default:
                cellsToRemove = 40;
        }

        while (cellsToRemove > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (this.grid[row][col] !== 0) {
                let temp = this.grid[row][col];
                this.grid[row][col] = 0;
                
                let copiedGrid = this.grid.map(row => [...row]);
                if (!this.hasUniqueSolution(copiedGrid)) {
                    this.grid[row][col] = temp;
                } else {
                    cellsToRemove--;
                }
            }
        }
    }

    hasUniqueSolution(grid) {
        let solutions = 0;
        this.solveSudoku(grid, 0, 0, (solution) => {
            solutions++;
            return solutions > 1;
        });
        return solutions === 1;
    }

    solveSudoku(grid, row, col, callback) {
        if (col === 9) {
            row++;
            col = 0;
            if (row === 9) return callback(grid);
        }

        if (grid[row][col] !== 0) return this.solveSudoku(grid, row, col + 1, callback);

        for (let num = 1; num <= 9; num++) {
            if (this.isValidInGrid(grid, row, col, num)) {
                grid[row][col] = num;
                if (this.solveSudoku(grid, row, col + 1, callback)) return true;
                grid[row][col] = 0;
            }
        }

        return false;
    }

    isValidInGrid(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }

        let boxRow = Math.floor(row / 3) * 3;
        let boxCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) return false;
            }
        }

        return true;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}