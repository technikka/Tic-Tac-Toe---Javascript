const Player = (token) => {
  let name;
  const getName = () => name;
  const setName = (input) => { name = input }
  const getToken = () => token;

  return { getName, setName, getToken }
};


const GameBoard = (() => {
  let row1 = Array(3).fill(' ');
  let row2 = Array(3).fill(' ');
  let row3 = Array(3).fill(' ');

  // row needs 'row1, row2, row3', and column needs 0, 1, 2
  const updateBoard = (square) => {
    console.log(GameControls.playableSquare);
    square.removeEventListener('click', GameControls.playableSquare);
    square.classList.remove('playable-square');

    // row[column] = Game.getTurn();
    // console.log(row1, row2, row3);
  }

  return { updateBoard, row1, row2, row3 }
})();


const GameControls = (() => {
  const toggleSetPlayerModal = () => {
    let modal = document.querySelector('.player-modal');
    let backdrop = document.querySelector('.backdrop');
    modal.classList.toggle('show');
    backdrop.classList.toggle('show');
    document.querySelector('.player-1-name').focus();
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

  const playableSquare = function() {
    Game.playTurn(this);
  }

  const setEventListeners = () => {
    const nameBtn = document.querySelector('.name-btn');
    nameBtn.addEventListener('click', event => {
      GameControls.toggleSetPlayerModal();
    })
    const setBtn = document.querySelector('.player-modal > section > button');
    setBtn.addEventListener('click', event => {
      toggleSetPlayerModal();
      Game.setPlayerNames();
      displayPlayerTurn();
    })

    const playSquares = document.querySelectorAll('.game-board > div > div');

    for (let i = 0; i < playSquares.length; i++) {
      playSquares[i].addEventListener('click', playableSquare);
      playSquares[i].classList.add('playable-square');
    }
  }

  return { 
    setEventListeners, 
    toggleSetPlayerModal,
    displayPlayerTurn,
    playableSquare
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

  const playTurn = (square) => {
    placeToken(square);
    GameBoard.updateBoard(square);
    toggleTurn();
    GameControls.displayPlayerTurn();
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