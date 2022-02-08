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
  function returnToHomePage() {
    const returnBtn = document.querySelector(".return-btn");
    let destination = "home";
    returnBtn.addEventListener("click", changeScreen.bind(null, destination));
  }

  function moveToGame() {
    const startGameBtn = document.querySelector(".start-game-btn");
    let destination = "game";
    startGameBtn.addEventListener("click", () => {
      changeScreen(destination);
      displayController.startGame();
    });
  }

  function changeScreen(destination) {
    const helpPrompt = document.querySelector(".help-prompt");
    const header = document.querySelector(".header");
    const startingPage = document.querySelector(".starting-page");
    const startGameBtn = document.querySelector(".start-game-btn");
    const gameSection = document.querySelector(".game-section");
    if (destination === "home") {
      helpPrompt.classList.remove("hidden");
      header.classList.remove("hidden");
      startingPage.classList.remove("hidden");
      startGameBtn.classList.remove("hidden");
      gameSection.classList.add("hidden");
    } else if (
      destination === "game" &&
      players.playerOne &&
      players.playerTwo
    ) {
      helpPrompt.classList.add("hidden");
      header.classList.add("hidden");
      startingPage.classList.add("hidden");
      startGameBtn.classList.add("hidden");
      gameSection.classList.remove("hidden");
      returnToHomePage();
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
      players.playerOne = Player(type, marker, "Player One");
    } else {
      players.playerTwo = Player(type, marker, "Player Two");
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
    const unmarkedCells = cells.filter((cell) => cell.textContent === "");
    const randomIndex = Math.floor(Math.random() * unmarkedCells.length);
    unmarkedCells.forEach((cell, index) => {
      if (index === randomIndex) {
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
    winMessage.textContent = `${player.name} has won!`;
    document
      .querySelectorAll(".grid-cell")
      .forEach((cell) => cell.classList.add("no-events"));
    // Adding winMessage after mainGame
    mainGame.parentElement.insertBefore(winMessage, mainGame);
    setTimeout(playGameAgain.bind(null, winMessage), 2000);
  };

  const playGameAgain = (winMessage) => {
    let wantsToPlayAgain = confirm(
      "The game has ended. Would you like to play again?"
    );
    if (wantsToPlayAgain) {
      players.playerOne.score = 0;
      players.playerTwo.score = 0;
      document
        .querySelectorAll(".grid-cell")
        .forEach((cell) => cell.classList.remove("no-events"));
      document.querySelector(".player-one-score").textContent =
        players.playerOne.score;
      document.querySelector(".player-two-score").textContent =
        players.playerTwo.score;
      winMessage.remove();
      document.querySelector(".first-player").classList.add("selected");
      document.querySelector(".second-player").classList.remove("selected");
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
    let gameEnd = checkForRoundWin() || checkForRoundDraw();
    if (gameEnd) {
      return score(startingPlayer, depth);
    }
    depth += 1;
    let moves = [];
    let scores = [];
    for (let i in possibleMoves) {
      let currentIndex = possibleMoves[i];
      if (depth > 1) {
        switchCurrentPlayer();
      }
      gameBoardArr[currentIndex] = currentPlayer.marker;
      scores.push(miniMax(startingPlayer, depth));
      moves.push(possibleMoves[i]);
      gameBoardArr[currentIndex] = "";
      currentPlayer = depth > 1 ? startingPlayer : currentPlayer;
    }
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

  const useMinimax = () => {
    let startingArray = [...gameBoardArr];
    let startingPlayer = currentPlayer;
    miniMax(startingPlayer, 0);
    gameBoardArr = startingArray;
  };

  const getPossibleMoves = () =>
    gameBoardArr
      .map((item, index) => (item !== "X" && item !== "O" ? index : null))
      .filter((item) => item);

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
    getWinningIndices,
    checkForRoundWin,
    checkForRoundDraw,
    useMinimax,
    getChoice,
  };
})();

// Player factory
const Player = (type, marker, name) => {
  return { type, marker, name, score: 0 };
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
      intervalId = setInterval(() => {
        let currentPlayer = gameBoard.getCurrentPlayer();
        if (playerOne.score < 3 && playerTwo.score < 3) {
          gameControl.performBotFunctions(currentPlayer);
        }
      }, 2200);
    } else if (playerOne.type === "Bot") {
      disableCells(cells, 1100);
      setTimeout(gameControl.performBotFunctions.bind(null, playerOne), 1000);
    }
    mainGrid.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("grid-cell") &&
        e.target.textContent === ""
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
        }
        activePlayer = gameBoard.getCurrentPlayer();
        if (activePlayer.type === "Bot") {
          disableCells(cells, 1100);
          setTimeout(
            gameControl.performBotFunctions.bind(null, activePlayer),
            1000
          );
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
    displayPlayerScore(activePlayer);
    setTimeout(resetGame, 2100);
  };

  const performRoundDrawFunctions = () => {
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.add("draw");
      setTimeout(removeDrawClass.bind(null, cell), 2100);
    });
    setTimeout(resetGame, 2100);
  };

  const displayPlayerScore = (player) => {
    if (player.name === "Player One") {
      document.querySelector(".player-one-score").textContent = player.score;
    } else {
      document.querySelector(".player-two-score").textContent = player.score;
    }
  };

  const toggleWinningCellsAnimation = (indices) => {
    const cells = Array.from(document.querySelectorAll(".grid-cell"));
    const winningCells = cells.filter((cell) =>
      indices.includes(+cell.getAttribute("data-number") - 1)
    );
    const nonWinningCells = cells.filter(
      (cell) => !winningCells.includes(cell)
    );
    for (let winningCell of winningCells) {
      winningCell.classList.add("winning-cell");
      setTimeout(removeWinningClass.bind(null, winningCell), 2100);
    }
    disableCells(nonWinningCells, 2100);
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

  const checkForBotTurn = (currentPlayer) => {
    if (currentPlayer.type === "Bot") {
      gameControl.performBotFunctions(currentPlayer);
    }
  };

  const resetGame = () => {
    const emptyArr = ["", "", "", "", "", "", "", "", ""];
    gameBoard.setGameboardArr(emptyArr);
    document
      .querySelectorAll(".grid-cell")
      .forEach((cell) => (cell.textContent = ""));
    let playerOne = gameControl.getPlayers().playerOne;
    let playerTwo = gameControl.getPlayers().playerTwo;
    gameBoard.setCurrentPlayer(playerOne);
    displayActivePlayer();
    let currentPlayer = gameBoard.getCurrentPlayer();
    if (
      currentPlayer.score < 3 &&
      (playerOne.type === "Player" || playerTwo.type === "Player")
    ) {
      setTimeout(checkForBotTurn.bind(null, currentPlayer), 1000);
    }
  };

  const getIntervalId = () => intervalId;

  return {
    startGame,
    resetGame,
    showMarkerColor,
    displayActivePlayer,
    performRoundDrawFunctions,
    performRoundWinFunctions,
    getIntervalId,
  };
})();
