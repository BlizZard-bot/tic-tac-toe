const gameControl = (() => {
  const players = {};

  function getPlayerData() {
    const startingPage = document.querySelector(".starting-page");
    startingPage.addEventListener("click", (e) => {
      if (e.target.textContent === "Player" || e.target.textContent === "Bot") {
        setPlayerData(e.target, players);
        displayController.changeIconOnSelection(e.target);
      }
    });
  }

  function setPlayerData(button, players) {
    let playerMarker = getPlayerMarker(button);
    const type = button.textContent;
    displayController.styleSelectedButton(button);
    if (playerMarker === "X") {
      players.playerOne = Player(type, playerMarker);
    } else {
      players.playerTwo = Player(type, playerMarker);
    }
    gameBoard.setPlayers(players);
    gameBoard.setCurrentPlayer(players.playerOne);
  }

  const getPlayerMarker = (button) => {
    const firstPlayerMarker = document.querySelector(".first-player-selection");
    const secondPlayerMarker = document.querySelector(
      ".second-player-selection"
    );
    if (button.classList.contains("first-player-btn")) {
      return firstPlayerMarker.textContent;
    } else {
      return secondPlayerMarker.textContent;
    }
  };

  const startGame = () => {
    const mainGrid = document.querySelector(".main-grid");
    let playerOne = players.playerOne;
    let playerTwo = players.playerTwo;
    if (playerOne.type === "Bot" && playerTwo.type === "Bot") {
      setInterval(() => {
        let currentPlayer = gameBoard.getCurrentPlayer();
        if (playerOne.score < 3 && playerTwo.score < 3) {
          gameBoard.performBotFunctions(currentPlayer);
        }
      }, 2200);
    } else if (playerOne.type === "Bot") {
      setTimeout(gameBoard.performBotFunctions.bind(null, playerOne), 1000);
    }
    mainGrid.addEventListener("click", (e) => {
      let currentPlayer = gameBoard.getCurrentPlayer();
      if (
        e.target.classList.contains("grid-cell") &&
        e.target.textContent === "" &&
        currentPlayer.type !== "Bot"
      ) {
        gameBoard.performPlayerFunctions(e);
        if (gameBoard.isBotTurn()) {
          currentPlayer = gameBoard.getCurrentPlayer();
          setTimeout(
            gameBoard.performBotFunctions.bind(null, currentPlayer),
            1000
          );
        }
      }
    });
  };

  const getPlayers = () => players;

  return {
    getPlayerData,
    getPlayers,
    startGame,
  };
})();

const Player = (type, marker) => {
  return { type, marker, score: 0 };
};

const gameBoard = (() => {
  let players;
  let currentPlayer;
  let bestMove;
  let gameBoardArr = ["", "", "", "", "", "", "", "", ""];
  let winningIndices;
  const cells = [...document.querySelectorAll(".grid-cell")];

  function performPlayerFunctions(e) {
    let selectedCell = e.target;
    populateBoardArr(selectedCell);
    checkForRoundEnd();
    displayController.displayMarker(
      selectedCell,
      getgameBoardArrIndex(selectedCell)
    );
    displayController.displayActivePlayer();
  }

  const performBotFunctions = (currentPlayer) => {
    let startingPlayer = currentPlayer;
    let startingArray = gameBoardArr;
    findBestMove(startingPlayer, startingArray);
    cells.forEach((cell, index) => {
      if (index === bestMove) {
        populateBoardArr(cell);
        displayController.displayMarker(cell, index);
      }
    });
    checkForRoundEnd();
    displayController.displayActivePlayer();
  };

  function miniMax(startingPlayer, depth) {
    const possibleMoves = getPossibleMoves();
    if (possibleMoves.length === 9) {
      let randomMove = Math.floor(Math.random() * possibleMoves.length);
      bestMove = possibleMoves[randomMove];
      return;
    }
    let gameEnd = isRoundWon() || isRoundDrawn();
    if (gameEnd) {
      return minimaxScore(startingPlayer, depth);
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
      bestMove = moves[maxIndex];
      return scores[maxIndex];
    } else {
      let minIndex = scores.indexOf(Math.min(...scores));
      bestMove = moves[minIndex];
      return scores[minIndex];
    }
  }

  function minimaxScore(startingPlayer, depth) {
    if (currentPlayer === startingPlayer && isRoundWon()) {
      return 10 - depth;
    } else if (currentPlayer !== startingPlayer && isRoundWon()) {
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

  const findBestMove = (startingPlayer, startingArray) => {
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
    const index = +cell.getAttribute("data-index");
    gameBoardArr[index] = currentPlayer.marker;
  };

  const getgameBoardArrIndex = (cell) => {
    for (let i in gameBoardArr) {
      if (Number(cell.dataset.index) === Number(i)) {
        return i;
      }
    }
  };

  const isBotTurn = () => {
    let otherPlayer;
    if (currentPlayer === players.playerOne) {
      otherPlayer = players.playerTwo;
    } else {
      otherPlayer = players.playerOne;
    }
    if (
      currentPlayer.type === "Bot" &&
      currentPlayer.score < 3 &&
      otherPlayer.type !== "Bot"
    ) {
      return true;
    }
    return false;
  };

  const checkForRoundEnd = () => {
    if (isRoundWon()) {
      performRoundWinFunctions(currentPlayer);
      setTimeout(checkForGameWin.bind(null, currentPlayer), 2100);
    } else if (isRoundDrawn()) {
      performRoundDrawFunctions();
    } else {
      switchCurrentPlayer();
    }
  };

  const checkForGameWin = (player) => {
    if (player.score === 3) {
      resetGame();
      const winMessage = document.querySelector(".win-message");
      winMessage.textContent = `${player.marker} has won!`;
      document
        .querySelectorAll(".grid-cell")
        .forEach((cell) => cell.classList.add("no-events"));
      setTimeout(playGameAgain, 2000);
    }
  };

  const playGameAgain = () => {
    displayController.displayResetGameModal();
    const resetGameBtn = document.querySelector(".reset-game-btn");
    resetGameBtn.addEventListener("click", () => {
      window.location.reload();
    });
  };

  const resetGame = () => {
    gameBoardArr = new Array(9).fill("");
    cells.forEach((cell) => (cell.textContent = ""));
    currentPlayer = players.playerOne;
    displayController.displayActivePlayer();
    if (gameBoard.isBotTurn()) {
      setTimeout(
        gameBoard.performBotFunctions.bind(null, players.playerOne),
        1000
      );
    }
  };

  const performRoundWinFunctions = (activePlayer) => {
    displayController.toggleWinningCellsAnimation(winningIndices);
    activePlayer.score += 1;
    displayController.displayPlayerScores();
    setTimeout(resetGame, 2100);
  };

  const performRoundDrawFunctions = () => {
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.add("draw");
      setTimeout(displayController.removeDrawClass.bind(null, cell), 2100);
    });
    setTimeout(resetGame, 2100);
  };

  const isRoundDrawn = () => {
    return gameBoardArr.every((item) => item);
  };

  const isRoundWon = () => {
    // Storing whether direction wins have occurred(true or false) in variables
    let horizontalWin = checkForHorizontalWin();
    let verticalWin = checkForVerticalWin();
    let rightDiagonalWin = checkForRightDiagonalWin();
    let leftDiagonalWin = checkForLeftDiagonalWin();
    // If one is true return true, otherwise return false
    return horizontalWin || verticalWin || rightDiagonalWin || leftDiagonalWin;
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
    // Iterating over the loop based on common patterns in win conditions.
    // See win conditions section in README for details
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

  const checkForHorizontalWin = () =>
    checkForCertainDirectionWin(0, 1, 2, 3, gameBoardArr, currentPlayer);

  const checkForVerticalWin = () =>
    checkForCertainDirectionWin(0, 3, 6, 1, gameBoardArr, currentPlayer);

  const checkForLeftDiagonalWin = () =>
    checkForCertainDirectionWin(0, 4, 8, 0, gameBoardArr, currentPlayer);

  const checkForRightDiagonalWin = () =>
    checkForCertainDirectionWin(2, 4, 6, 0, gameBoardArr, currentPlayer);

  const setPlayers = (playerData) => (players = playerData);
  const setCurrentPlayer = (player) => (currentPlayer = player);
  const getCurrentPlayer = () => currentPlayer;

  return {
    setCurrentPlayer,
    getCurrentPlayer,
    setPlayers,
    get gameBoardArr() {
      return gameBoardArr;
    },
    isBotTurn,
    performPlayerFunctions,
    performBotFunctions,
  };
})();

const displayController = (() => {
  const cells = [...document.querySelectorAll(".grid-cell")];

  function enableThemeToggle() {
    const darkThemeBtn = document.querySelector(".dark-toggle");
    const lightThemeBtn = document.querySelector(".light-toggle");
    const resetGameModal = document.querySelector(".reset-game-modal");
    darkThemeBtn.addEventListener("click", () => {
      toDarkMode(document.body);
      toDarkMode(resetGameModal);
    });

    lightThemeBtn.addEventListener("click", () => {
      toLightMode(document.body);
      toLightMode(resetGameModal);
    });
  }
  const toLightMode = (element) => {
    element.classList.remove("dark-mode");
    element.classList.add("light-mode");
  };

  const toDarkMode = (element) => {
    element.classList.remove("light-mode");
    element.classList.add("dark-mode");
  };

  function enableReturnButton() {
    const returnBtn = document.querySelector(".return-btn");
    returnBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  function enableStartButton() {
    const startGameBtn = document.querySelector(".start-game-btn");
    startGameBtn.addEventListener("click", () => {
      displayGameScreen();
      gameControl.startGame();
    });
  }

  function displayGameScreen() {
    const players = gameControl.getPlayers();
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

  const displayMarker = (cell, index) => {
    const gameBoardArr = gameBoard.gameBoardArr;
    cell.textContent = gameBoardArr[index];
    showMarkerColor(cell);
  };

  const showMarkerColor = (cell) => {
    if (cell.textContent === "X") {
      cell.style.color = "var(--accent-color-orange)";
    } else {
      cell.style.color = "var(--accent-color-purple)";
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

  const displayPlayerScores = () => {
    let playerOne = gameControl.getPlayers().playerOne;
    let playerTwo = gameControl.getPlayers().playerTwo;
    document.querySelector(".player-one-score").textContent = playerOne.score;
    document.querySelector(".player-two-score").textContent = playerTwo.score;
  };

  const toggleWinningCellsAnimation = (indices) => {
    const winningCells = cells.filter((cell) =>
      indices.includes(+cell.getAttribute("data-index"))
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

  const displayResetGameModal = () => {
    const resetGameModal = document.querySelector(".reset-game-modal");
    resetGameModal.showModal();
  };

  return {
    enableThemeToggle,
    enableStartButton,
    changeIconOnSelection,
    styleSelectedButton,
    showMarkerColor,
    displayActivePlayer,
    displayPlayerScores,
    displayMarker,
    toggleWinningCellsAnimation,
    removeDrawClass,
    displayResetGameModal,
  };
})();

gameControl.getPlayerData();
displayController.enableThemeToggle();
displayController.enableStartButton();
