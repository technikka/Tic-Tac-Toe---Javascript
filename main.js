const Player = (token) => {
  let name;
  const getName = () => name;
  const setName = (input) => { name = input }
  const getToken = () => token;

  return { getName, setName, getToken }
};


const GameBoard = (() => {
  let col1 = Array(3).fill(' ');
  let col2 = Array(3).fill(' ');
  let col3 = Array(3).fill(' ');

  const updateBoardDisplay = (square) => {
    square.removeEventListener('click', GameControls.playableSquare);
    square.classList.remove('playable-square');
  }

  // column needs 'col1', 'col2', or 'col3' and row needs 0, 1, 2
  const updateBoardArray = (column, row) => {
    eval(column)[row] = Game.getTurn();
    // console.log(col1, col2, col3);
  }
  return { updateBoardDisplay, updateBoardArray, col1, col2, col3 }
})();


const GameControls = (() => {
  const toggleSetPlayerModal = () => {
    let modal = document.querySelector('.player-modal');
    let backdrop = document.querySelector('.backdrop');
    modal.classList.toggle('show');
    backdrop.classList.toggle('show');
    document.querySelector('.player-1-name').focus();
  }

  const toggleAlertModal = (alert) => {
    let modal = document.querySelector('.alert-modal');
    let backdrop = document.querySelector('.backdrop');
    modal.classList.toggle('show');
    backdrop.classList.toggle('show');
    modal.textContent = alert;
  }

  const _closeModals = () => {
    let playerModal = document.querySelector('.player-modal');
    let alertModal = document.querySelector('.alert-modal');
    let backdrop = document.querySelector('.backdrop');
    playerModal.classList.remove('show');
    alertModal.classList.remove('show');
    backdrop.classList.remove('show');
  }

  const displayPlayerTurn = () => {
    const turnDiv = document.querySelector('.player-turn');
    const turn = Game.getTurn();
    if (Game.player1.getName() !== undefined ) {
      if (turn === 'X') {
        turnDiv.textContent = `Turn: ${Game.player1.getName()}`
      } else {
        turnDiv.textContent = `Turn: ${Game.player2.getName()}`
      }
    } else {
      turnDiv.textContent = `Turn: ${Game.getTurn()}`
    }
  }

  const _playableSquare = function() {
    Game.playTurn(this);
  }

  const setEventListeners = () => {
    const nameBtn = document.querySelector('.name-btn');
    nameBtn.addEventListener('click', event => {
      toggleSetPlayerModal();
    })
    const setBtn = document.querySelector('.player-modal > section > button');
    setBtn.addEventListener('click', event => {
      toggleSetPlayerModal();
      Game.setPlayerNames();
      displayPlayerTurn();
    })
    const playSquares = document.querySelectorAll('.game-board > div > div');
    for (let i = 0; i < playSquares.length; i++) {
      playSquares[i].addEventListener('click', _playableSquare);
      playSquares[i].classList.add('playable-square');
    }
    const body = document.querySelector('body');
    document.addEventListener('click', event => {
      let target = event.target;
      if (target === body) {
        _closeModals();
      }
    })
  }

  return { 
    setEventListeners, 
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
      square.style.color = "blue";
    } else {
      square.textContent = "O";
      square.style.color = "green";
    }
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

  const playTurn = (square) => {
    if (square.classList.contains('playable-square')) {
      let column = square.parentNode.classList[0];
      let row = _findRow(square);
      placeToken(square);
      GameBoard.updateBoardArray(column, row);
      GameBoard.updateBoardDisplay(square);
      toggleTurn();
      GameControls.displayPlayerTurn();
      if (isTie() === true) {
        GameControls.toggleAlertModal('Tie!');
      }
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

  return { 
    playTurn,
    createPlayers, 
    setPlayerNames, 
    placeToken,
    getTurn, 
    player1, 
    player2 
  }
})();


GameControls.setEventListeners();
Game.createPlayers();
GameControls.displayPlayerTurn();