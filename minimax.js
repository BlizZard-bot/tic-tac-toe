// Sample trying to create a minmax function
let staringPlayer = gameBoard.getCurrentPlayer();
function miniMax(boardArr, depth) {
  let currentPlayer = gameBoard.getCurrentPlayer();
  const possibleMoves = getPossibleMoves(boardArr);
  let gameEnd = boardArr.checkForRoundWin() || boardArr.checkForRoundDraw();
  if (gameEnd) {
    return score(currentPlayer, depth);
  }
  depth += 1;
  let moves = [];
  let scores = [];
  let choice;
  for (let possibleMove of possibleMoves) {
    scores.push(miniMax(possibleMoves, depth));
    moves.push(possibleMove);
  }
  if (currentPlayer === staringPlayer) {
    let maxIndex = scores.sort((a, b) => b - a)[0];
    choice = moves[maxIndex];
    return scores[maxIndex];
  } else {
    let minIndex = scores.sort((a, b) => a - b)[0];
    choice = moves[minIndex];
    return scores[minIndex];
  }
}

function score(currentPlayer, depth) {
  let otherPlayer = getOtherPlayer(currentPlayer);
  if (gameBoard.checkForRoundWin(currentPlayer)) {
    return 10 - depth;
  } else if (gameBoard.checkForRoundWin(otherPlayer)) {
    return depth - 10;
  } else {
    return 0;
  }
}

const getOtherPlayer = (currentPlayer) => {
  if (currentPlayer.marker === "X") {
    return players.playerTwo;
  } else {
    return players.playerOne;
  }
};

const getPossibleMoves = (board) => board.filter((item) => item === "");

const switchCurrentPlayer = () => {
  if (currentPlayer === players.playerOne) {
    currentPlayer = players.playerTwo;
  } else {
    currentPlayer = players.playerOne;
  }
};
