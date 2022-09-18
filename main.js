const Player = (token) => {
  let name;
  const getName = () => name;
  const setName = (input) => { name = input }
  const getToken = () => token;

  return { getName, setName, getToken }
};


const GameBoard = (() => {
  let col1 = Array(3).fill('');
  let col2 = Array(3).fill('');
  let col3 = Array(3).fill('');

  const resetBoard = () => {
    col1.splice(0, 3, '', '', '');
    col2.splice(0, 3, '', '', '');
    col3.splice(0, 3, '', '', '');
  }

  const _findRow = (square) => {
    const isSquare = (element) => {
      if (element.classList !== undefined &&
        element.localName === "div") {
        return 1
      } else {
        return 0
      }
    }
    let siblings = square.parentNode.childNodes;
    let squares = Array.from(siblings).filter(isSquare);
    return squares.indexOf(square);
  }

  const updateBoard = (square) => {
    square.classList.remove('playable-square');
    let column = square.parentNode.classList[0];
    let row = _findRow(square);
    eval(column)[row] = Game.getTurn();
  }

  return { updateBoard, resetBoard, col1, col2, col3 }
})();


const GameControls = (() => {
  const backdrop = document.querySelector('.backdrop');
  const playerModal = document.querySelector('.player-modal');
  const alertModal = document.querySelector('.alert-modal');

  const toggleSetPlayerModal = () => {
    playerModal.classList.toggle('show');
    backdrop.classList.toggle('show');
    document.querySelector('.player-1-name').focus();
  }

  const toggleAlertModal = (alert) => {
    alertModal.classList.toggle('show');
    backdrop.classList.toggle('show');
    alertModal.textContent = alert;
  }

  // not redundant, needed to close modals on click.
  const _closeModals = () => {
    playerModal.classList.remove('show');
    alertModal.classList.remove('show');
    backdrop.classList.remove('show');
  }

  const displayPlayerTurn = (replacementText) => {
    const turnDiv = document.querySelector('.player-turn');
    if (replacementText) {
      turnDiv.textContent = replacementText
      return
    }
    const turn = Game.getTurn();
    if (Game.player1.getName() !== undefined) {
      if (turn === 'X') {
        turnDiv.textContent = `Turn: ${Game.player1.getName()}`
      } else {
        turnDiv.textContent = `Turn: ${Game.player2.getName()}`
      }
    } else {
      turnDiv.textContent = `Turn: ${Game.getTurn()}`
    }
  }

  const _previewToken = function() {
    if (this.textContent === '') {
      Game.placeToken(this);
    }
  }

  const _removePreviewToken = function() {
    this.textContent = '';
  }

  const _playSquare = function() {
    this.removeEventListener('mouseout', _removePreviewToken);
    Game.playTurn(this);
  }

  const _initialSquareState = (square) => {
    square.textContent = '';
    square.classList.add('playable-square');
    square.addEventListener('click', _playSquare);
    square.addEventListener('mouseover', _previewToken);
    square.addEventListener('mouseout', _removePreviewToken);
  }

  const setEventListeners = () => {
    const nameBtn = document.querySelector('.name-btn');
    nameBtn.addEventListener('click', () => {
      toggleSetPlayerModal();
    })
    const setBtn = document.querySelector('.player-modal > section > button');
    setBtn.addEventListener('click', () => {
      toggleSetPlayerModal();
      Game.setPlayerNames();
      displayPlayerTurn();
    })
    const playSquares = document.querySelectorAll('.game-board > div > div');
    for (let i = 0; i < playSquares.length; i++) {
      _initialSquareState(playSquares[i]);
    }
    const page = document.querySelector('html');
    document.addEventListener('click', event => {
      let target = event.target;
      if (target === page) {
        _closeModals();
      }
    })
    const newGameBtn = document.querySelector('.new-game-btn');
    newGameBtn.addEventListener('click', () => {
      for (let i=0; i < playSquares.length; i++) {
        _initialSquareState(playSquares[i]);
      }
      GameBoard.resetBoard();
      Game.resetTurn();
      displayPlayerTurn();
    })
  }

  const removeEventListeners = (square) => {
    square.removeEventListener('click', _playSquare);
    square.removeEventListener('mouseover', _previewToken);
  }

  return { 
    setEventListeners,
    removeEventListeners, 
    toggleSetPlayerModal,
    displayPlayerTurn,
    toggleAlertModal
  }
})();


const Game = (() => {
  var currentTurn = "X";
  var player1 = undefined; 
  var player2 = undefined;

  const getTurn = () => {
    return currentTurn
  }

  const resetTurn = () => {
    currentTurn = "X"
  }

  const toggleTurn = () => {
    if (currentTurn === "X") {
      currentTurn = "O"
    } else {
      currentTurn = "X"
    }
  }

  const createPlayers = () => {
    Game.player1 = Player("X");
    Game.player2 = Player("O");
  }

  const setPlayerNames = () => {
    let name1 = document.querySelector('.player-1-name').value;
    let name2 = document.querySelector('.player-2-name').value;
    Game.player1.setName(name1);
    Game.player2.setName(name2);
  }

  const placeToken = (square) => {
    if (currentTurn === "X") {
      square.textContent = "X";
      square.style.color = "#5c00e6";
    } else {
      square.textContent = "O";
      square.style.color = "#00e600";
    }
  }

  const gameOver = () => {
    const playSquares = document.querySelectorAll('.game-board > div > div');
    for (let i=0; i < playSquares.length; i++) {
      GameControls.removeEventListeners(playSquares[i]);
      playSquares[i].classList.remove('playable-square');
    }
  }

  const _winner = () => { 
    const _tokenOwner = (token) => {
      if (token === 'X') {
        return Game.player1.getName();
      } else {
        return Game.player2.getName();
      }
    }
    let token = Game.getTurn();
    if (Game.player1.getName() !== undefined) {
      let name = _tokenOwner(token);
      return name
    } else {
      return token
    }
  }

  const playTurn = (square) => {
    if (square.classList.contains('playable-square')) {
      placeToken(square);
      GameBoard.updateBoard(square);
      if (isTie()) {
        GameControls.toggleAlertModal('Tie!');
        GameControls.displayPlayerTurn('Tie!');
        gameOver();
        return
      }
      if (isWin()) {
        GameControls.toggleAlertModal(`${_winner()} wins!`);
        GameControls.displayPlayerTurn(`${_winner()} wins!`);
        gameOver();
        return
      }
      toggleTurn();
      GameControls.displayPlayerTurn();
    }
  }

  const isTie = () => {
    let playableSquares = document.querySelector('.playable-square');
    if (playableSquares === null) {
      return true
    } else {
      return false
    }
  }

  const isWin = () => {
    const _allAreSame = (array) => {
      if (new Set(array).size === 1) {
        return true
      }
    }
    const _notEmptyString = (item) => {
      if (item.length > 0) {
        return true
      }
    }
    const _colWin = () => {
      let columns = [GameBoard.col1, GameBoard.col2, GameBoard.col3]
      for (let i = 0; i < columns.length; i++) {
        let array = columns[i]
        if (_allAreSame(array) && _notEmptyString(array[0])) {
          return true
        }
      }
    }
    const _rowWin = () => {
      for (let i = 0; i < 3; i++) {
        let rows = [GameBoard.col1[i], GameBoard.col2[i], GameBoard.col3[i]]
        if (_allAreSame(rows) && _notEmptyString(rows[0])) {
          return true
        }
      }
    }
    const _diagonalWin = () => {
      let diagonal1 = [GameBoard.col1[0], GameBoard.col2[1], GameBoard.col3[2]]
      let diagonal2 = [GameBoard.col1[2], GameBoard.col2[1], GameBoard.col3[0]]
      if ((_allAreSame(diagonal1) && _notEmptyString(diagonal1[0])) || (_allAreSame(diagonal2) && _notEmptyString(diagonal2[0]))) {
        return true
      }
    }

    if (_rowWin() || _colWin() || _diagonalWin()) {
      return true
    }
  }

  return { 
    playTurn,
    createPlayers, 
    setPlayerNames, 
    placeToken,
    getTurn,
    resetTurn, 
    player1, 
    player2 
  }
})();


GameControls.setEventListeners();
Game.createPlayers();
GameControls.displayPlayerTurn();