// Generate a Sudoku puzzle based on difficulty level
function generateSudoku(difficulty) {
    const grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    // Adjust the number of clues based on difficulty
    let emptyCells;
    if (difficulty === 'easy') emptyCells = 40;
    if (difficulty === 'medium') emptyCells = 50;
    if (difficulty === 'hard') emptyCells = 60;

    // Randomly remove numbers from the grid based on difficulty
    for (let i = 0; i < emptyCells; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        grid[row][col] = 0;
    }

    return grid;
}

function renderGrid(grid) {
    const table = document.getElementById('sudoku-grid');
    table.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            if (grid[i][j] !== 0) {
                cell.textContent = grid[i][j];
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('click', () => handleCellClick(i, j));
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}
