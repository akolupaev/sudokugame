// Function to check if a number placement is valid
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        // Check row, column, and 3x3 grid
        if (
            board[row][x] === num ||
            board[x][col] === num ||
            board[3 * Math.floor(row / 3) + Math.floor(x / 3)]
                 [3 * Math.floor(col / 3) + x % 3] === num
        ) {
            return false;
        }
    }
    return true;
}

// Function to generate a complete, valid Sudoku board
function generateCompleteBoard() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));

    function fillBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    for (let num of numbers) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard()) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fillBoard();
    return board;
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to remove numbers based on difficulty
function removeNumbers(board, difficulty) {
    let squaresToRemove = {
        'easy': 41,   // Approximately 50% unknown cells
        'medium': 46, // Approximately 60% unknown cells
        'hard': 50    // Approximately 70% unknown cells
    };

    let attempts = squaresToRemove[difficulty];

    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            let backup = board[row][col];
            board[row][col] = 0;

            let boardCopy = board.map(arr => arr.slice());
            let solutions = 0;

            function countSolutions(board) {
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        if (board[r][c] === 0) {
                            for (let n = 1; n <= 9; n++) {
                                if (isValid(board, r, c, n)) {
                                    board[r][c] = n;
                                    countSolutions(board);
                                    board[r][c] = 0;
                                }
                            }
                            return;
                        }
                    }
                }
                solutions++;
            }

            countSolutions(boardCopy);

            if (solutions !== 1) {
                board[row][col] = backup;
                attempts--;
            }
        }
    }
    return board;
}

// Exported function to generate a Sudoku puzzle
function generateSudoku(difficulty) {
    let completeBoard = generateCompleteBoard();
    let puzzleBoard = removeNumbers(completeBoard, difficulty);
    return puzzleBoard;
}
