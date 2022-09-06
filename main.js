const Player = (name, token) => {
  const name = () => name;
  const token = () => token;

  const takeTurn = () => {

  };
  
  return {
    name, token, takeTurn
  }
  
};


const GameBoard = (() => {
  let row1 = Array(3).fill(' ');
  let row2 = Array(3).fill(' ');
  let row3 = Array(3).fill(' ');

  return {
    row1, row2, row3
  }
})();


const Game = (() => {
  const _coinFlip = () => {
    let choices = ['X', 'O'];
    return choices[Math.round(Math.random())]
  };

  let turn = _coinFlip();

  return {
    turn
  }
})();
