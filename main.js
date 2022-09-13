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

  return { row1, row2, row3 }
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
    turnDiv.textContent = `Turn: ${Game.currentTurn}`
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
    })

    const playSquares = document.querySelectorAll('.game-board > div > div');
    for (let i = 0; i < playSquares.length; i++) {
      playSquares[i].addEventListener('click', event => {
        Game.placeToken(playSquares[i]);
      })
    }
  }

  return { 
    setEventListeners, 
    toggleSetPlayerModal,
    displayPlayerTurn
  }
})();


const Game = (() => {
  var currentTurn = "X";

  var player1 = undefined; 
  var player2 = undefined;

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

  return { 
    createPlayers, 
    setPlayerNames, 
    placeToken,
    currentTurn,  
    player1, 
    player2 
  }
})();


GameControls.setEventListeners();
Game.createPlayers();
GameControls.displayPlayerTurn();