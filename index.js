(function setTheme() {
  const darkThemeBtn = document.querySelector(".dark-toggle");
  const lightThemeBtn = document.querySelector(".light-toggle");
  darkThemeBtn.addEventListener("click", () => {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  });

  lightThemeBtn.addEventListener("click", () => {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  });
})();

// Main functionality
const gameControl = (() => {
  const players = {};
  function enableReturnButton() {
    const returnBtn = document.querySelector(".return-btn");
    returnBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  function moveToGame() {
    const startGameBtn = document.querySelector(".start-game-btn");
    startGameBtn.addEventListener("click", () => {
      displayGameScreen();
      displayController.startGame();
    });
  }

  function displayGameScreen() {
    const helpPrompt = document.querySelector(".help-prompt");
    const header = document.querySelector(".header");
    const startingPage = document.querySelector(".starting-page");
    const startGameBtn = document.querySelector(".start-game-btn");
    const gameSection = document.querySelector(".game-section");
    if (players.playerOne && players.playerTwo) {
      helpPrompt.classList.add("hidden");
      header.classList.add("hidden");
      startingPage.classList.add("hidden");
      startGameBtn.classList.add("hidden");
      gameSection.classList.remove("hidden");
      enableReturnButton();
    } else {
      alert("Select your players first");
    }
  }

  function getPlayerData() {
    const startingPage = document.querySelector(".starting-page");
    startingPage.addEventListener("click", (e) => {
      if (e.target.textContent === "Player" || e.target.textContent === "Bot") {
        setPlayerData(e.target, players);
        changeIconOnSelection(e.target);
      }
    });
  }

  function setPlayerData(item, players) {
    const marker =
      item.parentElement.parentElement.firstElementChild.textContent;
    const type = item.textContent;
    styleSelectedButton(item);
    if (marker === "X") {
      players.playerOne = Player(type, marker);
    } else {
      players.playerTwo = Player(type, marker);
    }
    gameBoard.setPlayers(players);
    gameBoard.setCurrentPlayer(players.playerOne);
  }

  function changeIconOnSelection(item) {
    const icon = item.parentElement.parentElement.querySelector("i");
    if (item.textContent === "Player") {
      icon.classList.remove("fa-robot");
      icon.classList.add("fa-user");
    } else {
      icon.classList.add("fa-robot");
      icon.classList.remove("fa-user");
    }
  }

  function styleSelectedButton(button) {
    if (
      button.textContent === "Player" &&
      !button.classList.contains("selected")
    ) {
      button.nextElementSibling.classList.remove("selected");
      button.classList.add("selected");
    } else if (
      button.textContent === "Bot" &&
      !button.classList.contains("selected")
    ) {
      button.previousElementSibling.classList.remove("selected");
      button.classList.add("selected");
    }
  }

  const performBotFunctions = (currentPlayer) => {
    let hasDrawnRound;
    const cells = [...document.querySelectorAll(".grid-cell")];
    let startingPlayer = gameBoard.getCurrentPlayer();
    let startingArray = gameBoard.getGameboardArr();
    gameBoard.useMinimax(startingPlayer, startingArray);
    const moveIndex = gameBoard.getChoice();
    cells.forEach((cell, index) => {
      if (index === moveIndex) {
        gameBoard.populateBoardArr(cell);
        cell.textContent = currentPlayer.marker;
        displayController.showMarkerColor(cell);
      }
    });
    let hasWonRound = gameBoard.checkForRoundWin();
    if (!hasWonRound) {
      hasDrawnRound = gameBoard.checkForRoundDraw();
    }
    if (hasWonRound) {
      displayController.performRoundWinFunctions(currentPlayer);
      if (currentPlayer.score === 3) {
        setTimeout(gameControl.checkForGameWin.bind(null, currentPlayer), 2100);
      }
    } else if (hasDrawnRound) {
      displayController.performRoundDrawFunctions();
    } else {
      gameBoard.switchCurrentPlayer();
      displayController.displayActivePlayer();
    }
  };

  const checkForGameWin = (player) => {
    displayController.resetGame();
    const winMessage = document.createElement("h2");
    const mainGame = document.querySelector(".main-game");
    winMessage.classList.add("win-message");
    winMessage.textContent = `${player.marker} has won!`;
    document
      .querySelectorAll(".grid-cell")
      .forEach((cell) => cell.classList.add("no-events"));
    // Adding winMessage after mainGame
    mainGame.parentElement.insertBefore(winMessage, mainGame);
    setTimeout(playGameAgain, 2000);
  };

  const playGameAgain = () => {
    let wantsToPlayAgain = confirm(
      "The game has ended. Would you like to play again?"
    );
    if (wantsToPlayAgain) {
      window.location.reload();
    }
  };

  const getPlayers = () => players;

  return {
    getPlayerData,
    moveToGame,
    getPlayers,
    checkForGameWin,
    performBotFunctions,
  };
})();

gameControl.getPlayerData();
gameControl.moveToGame();

// GameBoard
const gameBoard = (() => {
  let players;
  let currentPlayer;
  let choice;
  let gameBoardArr = ["", "", "", "", "", "", "", "", ""];
  let winningIndices;

  function miniMax(startingPlayer, depth) {
    const possibleMoves = getPossibleMoves();
    if (possibleMoves.length === 9) {
      let randomMove = Math.floor(Math.random() * possibleMoves.length);
      choice = possibleMoves[randomMove];
      return;
    }
    let gameEnd = checkForRoundWin() || checkForRoundDraw();
    if (gameEnd) {
      return score(startingPlayer, depth);
    }
    depth += 1;
    let moves = [];
    let scores = [];
    for (let i in possibleMoves) {
      computeCurrentPlayer(possibleMoves);
      let currentIndex = possibleMoves[i];
      gameBoardArr[currentIndex] = currentPlayer.marker;
      scores.push(miniMax(startingPlayer, depth));
      moves.push(possibleMoves[i]);
      gameBoardArr[currentIndex] = "";
    }
    computeCurrentPlayer(possibleMoves);
    if (currentPlayer === startingPlayer) {
      let maxIndex = scores.indexOf(Math.max(...scores));
      choice = moves[maxIndex];
      return scores[maxIndex];
    } else {
      let minIndex = scores.indexOf(Math.min(...scores));
      choice = moves[minIndex];
      return scores[minIndex];
    }
  }

  function score(startingPlayer, depth) {
    if (currentPlayer === startingPlayer && checkForRoundWin()) {
      return 10 - depth;
    } else if (currentPlayer !== startingPlayer && checkForRoundWin()) {
      return depth - 10;
    } else {
      return 0;
    }
  }

  const computeCurrentPlayer = (possibleMoves) => {
    if (isEven(possibleMoves.length)) {
      currentPlayer = players.playerTwo;
    } else {
      currentPlayer = players.playerOne;
    }
  };

  const isEven = (num) => {
    return num % 2 === 0;
  };

  const useMinimax = (startingPlayer, startingArray) => {
    miniMax(startingPlayer, 0);
    gameBoardArr = startingArray;
    currentPlayer = startingPlayer;
  };

  const getPossibleMoves = () =>
    gameBoardArr
      .map((item, index) => (item !== "X" && item !== "O" ? index : null))
      .filter((item) => typeof item === "number");

  const switchCurrentPlayer = () => {
    if (currentPlayer === players.playerOne) {
      currentPlayer = players.playerTwo;
    } else {
      currentPlayer = players.playerOne;
    }
  };

  const populateBoardArr = (cell) => {
    const index = +cell.getAttribute("data-number") - 1;
    gameBoardArr[index] = currentPlayer.marker;
  };

  const checkForRoundWin = () => {
    // Storing whether wins have occurred(true or false) in variables
    let horizontalWin = checkForHorizontalWin();
    let verticalWin = checkForVerticalWin();
    let rightDiagonalWin = checkForRightDiagonalWin();
    let leftDiagonalWin = checkForLeftDiagonalWin();
    // If one is true return true, otherwise return false
    return horizontalWin || verticalWin || rightDiagonalWin || leftDiagonalWin;
  };

  const checkForRoundDraw = () => {
    return gameBoardArr.every((item) => item);
  };

  const checkForCertainDirectionWin = (...args) => {
    // Extracting values from the arguments using the rest operator
    let [
      firstIteratorVal,
      secondIteratorVal,
      thirdIteratorVal,
      increment,
      arr,
      player,
    ] = args;
    // Iterating over the loop based on common patterns in win conditions. See Plan.md for details
    for (
      let i = firstIteratorVal, j = secondIteratorVal, k = thirdIteratorVal;
      i < arr.length, j < arr.length, k < arr.length;
      i += increment, j += increment, k += increment
    ) {
      // Checking if increment if more than 0 because if increment is less than 0 then it becomes an infinite loop
      // as in the case of diagonals
      if (increment > 0) {
        if (
          arr[i] === player.marker &&
          arr[j] === player.marker &&
          arr[k] === player.marker
        ) {
          winningIndices = [i, j, k];
          return true;
        }
        // Incorporating win conditions for diagonals
      } else {
        // Checking if all indices have the player's marker
        if (
          arr[i] === player.marker &&
          arr[j] === player.marker &&
          arr[k] === player.marker
        ) {
          winningIndices = [i, j, k];
          return true;
        }
        return false;
      }
    }
    return false;
  };

  // Win conditions for different directions. See Plan.md for further details
  // and illustrations

  const checkForHorizontalWin = () =>
    checkForCertainDirectionWin(0, 1, 2, 3, gameBoardArr, currentPlayer);

  const checkForVerticalWin = () =>
    checkForCertainDirectionWin(0, 3, 6, 1, gameBoardArr, currentPlayer);

  const checkForLeftDiagonalWin = () =>
    checkForCertainDirectionWin(0, 4, 8, 0, gameBoardArr, currentPlayer);

  const checkForRightDiagonalWin = () =>
    checkForCertainDirectionWin(2, 4, 6, 0, gameBoardArr, currentPlayer);

  const resetScores = () => {
    players.playerOne.score = 0;
    players.playerTwo.score = 0;
  };
  const setPlayers = (playerData) => (players = playerData);
  const setGameboardArr = (arr) => (gameBoardArr = arr);
  const getGameboardArr = () => gameBoardArr;
  const setCurrentPlayer = (player) => (currentPlayer = player);
  const getCurrentPlayer = () => currentPlayer;
  const getWinningIndices = () => winningIndices;
  const getChoice = () => choice;

  return {
    setGameboardArr,
    getGameboardArr,
    populateBoardArr,
    switchCurrentPlayer,
    setCurrentPlayer,
    getCurrentPlayer,
    setPlayers,
    resetScores,
    getWinningIndices,
    checkForRoundWin,
    checkForRoundDraw,
    useMinimax,
    getChoice,
  };
})();

// Player factory
const Player = (type, marker) => {
  return { type, marker, score: 0 };
};

// Display Control

const displayController = (() => {
  const startGame = () => {
    const mainGrid = document.querySelector(".main-grid");
    let playerOne = gameControl.getPlayers().playerOne;
    let playerTwo = gameControl.getPlayers().playerTwo;
    const cells = document.querySelectorAll(".grid-cell");
    if (playerOne.type === "Bot" && playerTwo.type === "Bot") {
      document
        .querySelectorAll(".grid-cell")
        .forEach((cell) => cell.classList.add("no-events"));
      setInterval(() => {
        let currentPlayer = gameBoard.getCurrentPlayer();
        if (playerOne.score < 3 && playerTwo.score < 3) {
          gameControl.performBotFunctions(currentPlayer);
        }
      }, 2200);
    } else if (playerOne.type === "Bot") {
      gameControl.performBotFunctions(playerOne);
    }
    mainGrid.addEventListener("click", (e) => {
      let currentPlayer = gameBoard.getCurrentPlayer();
      if (
        e.target.classList.contains("grid-cell") &&
        e.target.textContent === "" &&
        currentPlayer.type !== "Bot"
      ) {
        gameBoard.populateBoardArr(e.target);
        let gameBoardArr = gameBoard.getGameboardArr();
        let hasWonRound = gameBoard.checkForRoundWin();
        let hasDrawnRound = gameBoard.checkForRoundDraw();
        let activePlayer = gameBoard.getCurrentPlayer();
        if (hasWonRound) {
          performRoundWinFunctions(activePlayer);
          if (activePlayer.score === 3) {
            setTimeout(
              gameControl.checkForGameWin.bind(null, activePlayer),
              2100
            );
          }
          displayMarker(e.target, gameBoardArr);
        } else if (hasDrawnRound) {
          displayMarker(e.target, gameBoardArr);
          performRoundDrawFunctions();
        } else {
          gameBoard.switchCurrentPlayer();
          displayMarker(e.target, gameBoardArr);
          displayActivePlayer();
          activePlayer = gameBoard.getCurrentPlayer();
          if (activePlayer.type === "Bot") {
            setTimeout(
              gameControl.performBotFunctions.bind(null, activePlayer),
              1000
            );
          }
        }
      }
    });
  };

  const displayMarker = (cell, gameBoardArr) => {
    for (let i in gameBoardArr) {
      if (+cell.getAttribute("data-number") - 1 === +i) {
        cell.textContent = gameBoardArr[i];
        showMarkerColor(cell);
      }
    }
  };

  const showMarkerColor = (cell) => {
    if (cell.textContent === "X") {
      cell.style.color = "var(--bg-btn)";
    } else {
      cell.style.color = "var(--marker-color)";
    }
  };

  const displayActivePlayer = () => {
    let currentPlayer = gameBoard.getCurrentPlayer();
    const firstPlayerDisplay = document.querySelector(".first-player");
    const secondPlayerDisplay = document.querySelector(".second-player");
    if (currentPlayer.marker === "X") {
      firstPlayerDisplay.classList.add("selected");
      secondPlayerDisplay.classList.remove("selected");
    } else {
      firstPlayerDisplay.classList.remove("selected");
      secondPlayerDisplay.classList.add("selected");
    }
  };

  const performRoundWinFunctions = (activePlayer) => {
    let winningIndices = gameBoard.getWinningIndices();
    toggleWinningCellsAnimation(winningIndices);
    activePlayer.score += 1;
    displayPlayerScores();
    setTimeout(resetGame, 2100);
  };

  const performRoundDrawFunctions = () => {
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.add("draw");
      setTimeout(removeDrawClass.bind(null, cell), 2100);
    });
    setTimeout(resetGame, 2100);
  };

  const displayPlayerScores = () => {
    let playerOne = gameControl.getPlayers().playerOne;
    let playerTwo = gameControl.getPlayers().playerTwo;
    document.querySelector(".player-one-score").textContent = playerOne.score;
    document.querySelector(".player-two-score").textContent = playerTwo.score;
  };

  const toggleWinningCellsAnimation = (indices) => {
    const cells = Array.from(document.querySelectorAll(".grid-cell"));
    const winningCells = cells.filter((cell) =>
      indices.includes(+cell.getAttribute("data-number") - 1)
    );
    for (let winningCell of winningCells) {
      winningCell.classList.add("winning-cell");
      setTimeout(removeWinningClass.bind(null, winningCell), 2100);
    }
    disableCells(cells, 2100);
  };

  const disableCells = (cells, time) => {
    cells.forEach((cell) => {
      cell.classList.add("no-events");
      setTimeout(removePointerEvents.bind(null, cell), time);
    });
  };

  const removePointerEvents = (cell) => {
    cell.classList.remove("no-events");
  };

  const removeWinningClass = (winningCell) => {
    winningCell.classList.remove("winning-cell");
  };

  const removeDrawClass = (cell) => {
    cell.classList.remove("draw");
  };

  const resetGame = () => {
    let hasWonRound = gameBoard.checkForRoundWin();
    const emptyArr = new Array(9).fill("");
    gameBoard.setGameboardArr(emptyArr);
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach((cell) => (cell.textContent = ""));
    let playerOne = gameControl.getPlayers().playerOne;
    gameBoard.setCurrentPlayer(playerOne);
    displayActivePlayer();
    if (playerOne.type === "Bot" && hasWonRound && playerOne.score < 3) {
      setTimeout(gameControl.performBotFunctions.bind(null, playerOne), 1000);
    }
  };

  return {
    startGame,
    resetGame,
    showMarkerColor,
    displayActivePlayer,
    performRoundDrawFunctions,
    performRoundWinFunctions,
    displayPlayerScores,
  };
})();
