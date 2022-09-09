const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;
  
  return { getName, getToken }
};

const GameBoard = (() => {
  let row1 = Array(3).fill(' ');
  let row2 = Array(3).fill(' ');
  let row3 = Array(3).fill(' ');

  return { row1, row2, row3 }
})();

const GameControls = (() => {
  const toggleModal = () => {
    let modal = document.querySelector('.player-modal');
    let backdrop = document.querySelector('.backdrop');
    modal.classList.toggle('show');
    backdrop.classList.toggle('show');
    document.querySelector('.player-1-name').focus();
  }

  const setEventListeners = () => {
    const playBtn = document.querySelector('.play-btn');
    playBtn.addEventListener('click', event => {
      toggleModal();
    })
    const setBtn = document.querySelector('.player-modal > section > button');
    setBtn.addEventListener('click', event => {
      Game.createPlayers();
      toggleModal();
    })
  }

  return { setEventListeners }
})();

const Game = (() => {
  const _coinFlip = () => {
    let choices = ['X', 'O'];
    return choices[Math.round(Math.random())]
  };

  const startTurn = _coinFlip();

  var player1 = undefined;
  var player2 = undefined;

  const createPlayers = () => {
    let name1 = document.querySelector('.player-1-name').value;
    let name2 = document.querySelector('.player-2-name').value;
    Game.player1 = Player(name1, "X");
    Game.player2 = Player(name2, "O");
  }

  return { startTurn, createPlayers, player1, player2 }
})();

GameControls.setEventListeners();