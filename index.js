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
    console.log(players);
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

  const getPlayers = () => players;

  return { getPlayerData, moveToGame, getPlayers };
})();

gameControl.getPlayerData();
gameControl.moveToGame();

// GameBoard
const gameBoard = (() => {
  let players;
  let currentPlayer;
  let gameBoardArr = ["", "", "", "", "", "", "", "", ""];
  let winningIndices;
  const switchCurrentPlayer = (cell) => {
    if (cell.textContent === "") {
      if (currentPlayer === players.playerOne) {
        currentPlayer = players.playerTwo;
      } else {
        currentPlayer = players.playerOne;
      }
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
    const cells = Array.from(document.querySelectorAll(".grid-cell"));
    return cells.every((cell) => cell.textContent !== "");
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
  };
})();

// Player factory
const Player = (type, marker, name) => {
  return { type, marker, name, score: 0 };
};

// Display Control

const displayController = (() => {
  const displayMarkerOnClick = () => {
    const mainGrid = document.querySelector(".main-grid");
    mainGrid.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("grid-cell") &&
        e.target.textContent === ""
      ) {
        let gameBoardArr = gameBoard.getGameboardArr();
        gameBoard.populateBoardArr(e.target);
        let hasWonRound = gameBoard.checkForRoundWin();
        let hasDrawnRound = gameBoard.checkForRoundDraw();
        let activePlayer = gameBoard.getCurrentPlayer();
        if (hasWonRound) {
          performRoundWinFunctions(activePlayer);
        } else if (hasDrawnRound) {
          console.log("Round drawn");
          performRoundDrawFunctions();
        } else {
          gameBoard.switchCurrentPlayer(e.target);
          displayActivePlayer(activePlayer);
        }
        displayMarker(e.target, gameBoardArr);
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

  const displayActivePlayer = (currentPlayer) => {
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
    updatePlayerScore(activePlayer);
    setTimeout(resetGame, 2100);
  };

  const performRoundDrawFunctions = () => {
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.add("draw");
      setTimeout(removeDrawClass.bind(null, cell), 2100);
    });
    setTimeout(resetGame, 2100);
  };

  const updatePlayerScore = (player) => {
    player.score += 1;
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
    nonWinningCells.forEach((cell) => {
      cell.classList.add("no-events");
      setTimeout(removePointerEvents.bind(null, cell), 2100);
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
    const emptyArr = ["", "", "", "", "", "", "", "", ""];
    gameBoard.setGameboardArr(emptyArr);
    document
      .querySelectorAll(".grid-cell")
      .forEach((cell) => (cell.textContent = ""));
    gameBoard.setCurrentPlayer(gameControl.getPlayers().playerOne);
  };
  return { displayMarkerOnClick };
})();

displayController.displayMarkerOnClick();
