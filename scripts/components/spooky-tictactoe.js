// Spooky Tic-Tac-Toe - Halloween themed game

export class SpookyTicTacToe {
    constructor() {
        this.container = null;
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = '👻'; // Ghost
        this.gameActive = true;
        this.scores = { ghost: 0, pumpkin: 0, draws: 0 };
        
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        this.loadScores();
    }

    render() {
        this.container = document.getElementById('page-container');
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="tictactoe-page">
                <h1>🎃 Spooky Tic-Tac-Toe</h1>
                <p class="subtitle">Ghost vs Pumpkin - A Halloween Battle!</p>

                <div class="game-info">
                    <div class="current-turn">
                        <span class="turn-label">Current Turn:</span>
                        <span class="turn-player" id="current-turn">👻 Ghost</span>
                    </div>
                    
                    <div class="scoreboard">
                        <div class="score-item">
                            <span class="score-icon">👻</span>
                            <span class="score-value" id="ghost-score">${this.scores.ghost}</span>
                        </div>
                        <div class="score-item">
                            <span class="score-label">Draws</span>
                            <span class="score-value" id="draw-score">${this.scores.draws}</span>
                        </div>
                        <div class="score-item">
                            <span class="score-icon">🎃</span>
                            <span class="score-value" id="pumpkin-score">${this.scores.pumpkin}</span>
                        </div>
                    </div>
                </div>

                <div class="game-board" id="game-board">
                    ${this.renderBoard()}
                </div>

                <div class="game-status" id="game-status"></div>

                <div class="game-controls">
                    <button class="btn btn-primary" id="reset-btn">
                        🔄 New Game
                    </button>
                    <button class="btn btn-secondary" id="clear-scores-btn">
                        🗑️ Clear Scores
                    </button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderBoard() {
        return this.board.map((cell, index) => `
            <div class="cell" data-index="${index}">
                ${cell ? `<span class="cell-content">${cell}</span>` : ''}
            </div>
        `).join('');
    }

    attachEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        const clearScoresBtn = document.getElementById('clear-scores-btn');
        if (clearScoresBtn) {
            clearScoresBtn.addEventListener('click', () => this.clearScores());
        }
    }

    handleCellClick(e) {
        const cell = e.currentTarget;
        const index = parseInt(cell.dataset.index);

        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }

        // Make move
        this.board[index] = this.currentPlayer;
        cell.innerHTML = `<span class="cell-content cell-appear">${this.currentPlayer}</span>`;
        
        // Play sound
        if (window.audioManager) {
            window.audioManager.playSFX('release');
        }

        // Check for win or draw
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            // Switch player
            this.currentPlayer = this.currentPlayer === '👻' ? '🎃' : '👻';
            this.updateTurnDisplay();
        }
    }

    checkWin() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] !== '' &&
                   this.board[a] === this.board[b] &&
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        const winner = this.currentPlayer === '👻' ? 'Ghost' : 'Pumpkin';
        const statusEl = document.getElementById('game-status');
        
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="status-message win-message">
                    ${this.currentPlayer} ${winner} Wins! 🎉
                </div>
            `;
        }

        // Play win sound
        if (window.audioManager) {
            window.audioManager.playSFX('win');
        }

        // Update scores
        if (this.currentPlayer === '👻') {
            this.scores.ghost++;
            document.getElementById('ghost-score').textContent = this.scores.ghost;
        } else {
            this.scores.pumpkin++;
            document.getElementById('pumpkin-score').textContent = this.scores.pumpkin;
        }
        
        this.saveScores();
        this.highlightWinningCells();
    }

    handleDraw() {
        this.gameActive = false;
        const statusEl = document.getElementById('game-status');
        
        if (statusEl) {
            statusEl.innerHTML = `
                <div class="status-message draw-message">
                    It's a Draw! 👻🎃
                </div>
            `;
        }

        this.scores.draws++;
        document.getElementById('draw-score').textContent = this.scores.draws;
        this.saveScores();
    }

    highlightWinningCells() {
        this.winningConditions.forEach(condition => {
            const [a, b, c] = condition;
            if (this.board[a] !== '' &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                
                const cells = document.querySelectorAll('.cell');
                cells[a].classList.add('winning-cell');
                cells[b].classList.add('winning-cell');
                cells[c].classList.add('winning-cell');
            }
        });
    }

    updateTurnDisplay() {
        const turnEl = document.getElementById('current-turn');
        if (turnEl) {
            const playerName = this.currentPlayer === '👻' ? 'Ghost' : 'Pumpkin';
            turnEl.textContent = `${this.currentPlayer} ${playerName}`;
        }
    }

    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = '👻';
        this.gameActive = true;
        
        const boardEl = document.getElementById('game-board');
        if (boardEl) {
            boardEl.innerHTML = this.renderBoard();
        }
        
        const statusEl = document.getElementById('game-status');
        if (statusEl) {
            statusEl.innerHTML = '';
        }
        
        this.updateTurnDisplay();
        this.attachEventListeners();
    }

    clearScores() {
        this.scores = { ghost: 0, pumpkin: 0, draws: 0 };
        document.getElementById('ghost-score').textContent = '0';
        document.getElementById('pumpkin-score').textContent = '0';
        document.getElementById('draw-score').textContent = '0';
        this.saveScores();
    }

    saveScores() {
        localStorage.setItem('spookyTicTacToeScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const saved = localStorage.getItem('spookyTicTacToeScores');
        if (saved) {
            this.scores = JSON.parse(saved);
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
