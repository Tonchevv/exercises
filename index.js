window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const display = document.querySelector('.display');
    const announcer = document.querySelector('.announcer');
    const resetButton = document.getElementById('reset');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'O'; // You start as O
    let isGameActive = true;

    const PLAYER_O = 'O'; // You
    const PLAYER_X = 'X'; // AI

    const winningConditions = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6]          // diags
    ];

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }
        if (roundWon) {
            announce(currentPlayer === PLAYER_O ? 'YOU_WIN' : 'AI_WIN');
            isGameActive = false;
            return true;
        }
        if (!board.includes('')) {
            announce('TIE');
            isGameActive = false;
            return true;
        }
        return false;
    }

    function announce(type) {
        switch(type){
            case 'AI_WIN':
                announcer.innerHTML = 'AI (<span class="playerX">X</span>) Wins!';
                break;
            case 'YOU_WIN':
                announcer.innerHTML = 'You (<span class="playerO">O</span>) Win!';
                break;
            case 'TIE':
                announcer.innerText = 'Tie!';
        }
        announcer.classList.remove('hide');
    }

    function isValidAction(tile) {
        return tile.textContent === '';
    }

    function updateBoard(index) {
        board[index] = currentPlayer;
    }

    function changePlayer() {
        currentPlayer = currentPlayer === PLAYER_O ? PLAYER_X : PLAYER_O;
        display.innerHTML = `Player <span class="display-player player${currentPlayer}">${currentPlayer}</span>'s turn`;
    }

    function userAction(tile, index) {
        if (isValidAction(tile) && isGameActive && currentPlayer === PLAYER_O) {
            tile.textContent = PLAYER_O;
            tile.classList.add('playerO');
            updateBoard(index);
            if (!handleResultValidation()) {
                changePlayer();
                showAIThinking();
                setTimeout(aiMove, 1000); // AI moves after 1 second
            }
        }
    }

    function showAIThinking() {
        display.innerHTML = `AI (<span class="display-player playerX">X</span>) is thinking...`;
        tiles.forEach((tile, idx) => {
            if (board[idx] === '') {
                tile.classList.add('ai-thinking');
            }
        });
    }

    function hideAIThinking() {
        tiles.forEach(tile => tile.classList.remove('ai-thinking'));
    }

    function aiMove() {
        if (!isGameActive) {
            hideAIThinking();
            return;
        }
       
        const emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(idx => idx !== null);
        if (emptyIndices.length === 0) {
            hideAIThinking();
            return;
        }
        const aiIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        board[aiIndex] = PLAYER_X;
        tiles[aiIndex].textContent = PLAYER_X;
        tiles[aiIndex].classList.add('playerX');
        hideAIThinking();
        if (!handleResultValidation()) {
            changePlayer();
        }
    }

    function resetBoard() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        if (currentPlayer !== PLAYER_O) changePlayer();
        tiles.forEach(tile => {
            tile.textContent = '';
            tile.classList.remove('playerX', 'playerO', 'ai-thinking');
        });
        display.innerHTML = `Player <span class="display-player player${PLAYER_O}">${PLAYER_O}</span>'s turn`;
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);

    display.innerHTML = `Player <span class="display-player player${PLAYER_O}">${PLAYER_O}</span>'s turn`;
});