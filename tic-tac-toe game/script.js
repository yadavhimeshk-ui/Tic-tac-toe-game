const loginContainer = document.getElementById('login-container');
const gameContainer = document.getElementById('game-container');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('reset-btn');
const logoutBtn = document.getElementById('logout-btn');
const turnIndicator = document.getElementById('turn-indicator');
const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');
const drawsDisplay = document.getElementById('draws');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let currentUser = null;

// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('ticTacToeUsers')) || {};
    return userData[currentUser] || { xWins: 0, oWins: 0, draws: 0 };
}

// Save user data to localStorage
function saveUserData(data) {
    const userData = JSON.parse(localStorage.getItem('ticTacToeUsers')) || {};
    userData[currentUser] = data;
    localStorage.setItem('ticTacToeUsers', JSON.stringify(userData));
}

// Update scores display
function updateScores() {
    const data = loadUserData();
    xWinsDisplay.textContent = data.xWins;
    oWinsDisplay.textContent = data.oWins;
    drawsDisplay.textContent = data.draws;
}

// Update turn indicator
function updateTurnIndicator() {
    turnIndicator.textContent = `Player ${currentPlayer}'s turn`;
}

// Login handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = emailInput.value.trim();
    if (currentUser) {
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        updateScores();
        updateTurnIndicator();
    }
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    gameContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    resetGame();
});

// Cell click handler
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        if (gameState[index] !== '' || !gameActive) return;
        
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        
        if (checkWinner()) {
            gameActive = false;
            const data = loadUserData();
            if (currentPlayer === 'X') {
                data.xWins++;
                alert('Player X wins!');
            } else {
                data.oWins++;
                alert('Player O wins!');
            }
            saveUserData(data);
            updateScores();
        } else if (gameState.every(cell => cell !== '')) {
            gameActive = false;
            const data = loadUserData();
            data.draws++;
            saveUserData(data);
            updateScores();
            alert('Draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateTurnIndicator();
        }
    });
});

// Check for winner
function checkWinner() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winPatterns.some(pattern => {
        return pattern.every(index => gameState[index] === currentPlayer);
    });
}

// Reset game
function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    updateTurnIndicator();
}

// Reset button
resetBtn.addEventListener('click', resetGame);