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
      players.playerOne = Player(type, marker);
    } else {
      players.playerTwo = Player(type, marker);
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
  const gameBoardArr = [];
  const switchMarker = (cell) => {
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

  const checkForWin = () => {
    let hasWon = false;
    if (
      checkForHorizontalWin(gameBoard, currentPlayer) ||
      checkForVerticalWin(gameBoard, currentPlayer) ||
      checkForRightDiagonalWin(gameBoard, currentPlayer) ||
      checkForLeftDiagonalWin(gameBoard, currentPlayer)
    ) {
      hasWon = true;
    }
  };

  // Vertical win always means that the three indices will be consecutive, start from 0,1,2 and
  // increase by 3 for future iterations. See Plan.md for further details
  const checkForHorizontalWin = (arr, player) => {
    for (
      let i = 0, j = i + 1, k = j + 1;
      i < arr.length, j < arr.length, k < arr.length;
      i += 3, j += 3, k += 3
    ) {
      if (
        player.marker === arr[i] &&
        player.marker === arr[j] &&
        player.marker === arr[k]
      ) {
        return true;
      }
    }
    return false;
  };

  const checkForVerticalWin = (arr, player) => {
    for (
      let i = 0, j = i + 3, k = j + 3;
      i < arr.length, j < arr.length, k < arr.length;
      i++, j++, k++
    ) {
      if (
        player.marker === arr[i] &&
        player.marker === arr[j] &&
        player.marker === arr[k]
      ) {
        return true;
      }
    }
    return false;
  };

  const checkForLeftDiagonalWin = (arr, player) => {
    if (
      arr[0] === player.marker &&
      arr[4] === player.marker &&
      arr[8] === player.marker
    ) {
      return true;
    }
    return false;
  };

  const checkForRightDiagonalWin = (arr, player) => {
    if (
      arr[2] === player.marker &&
      arr[4] === player.marker &&
      arr[6] === player.marker
    ) {
      return true;
    }
    return false;
  };

  const setPlayers = (playerData) => (players = playerData);
  const getGameboardArr = () => gameBoardArr;
  const setCurrentPlayer = (player) => (currentPlayer = player);
  const getCurrentPlayer = () => currentPlayer;

  return {
    getGameboardArr,
    populateBoardArr,
    switchMarker,
    setCurrentPlayer,
    getCurrentPlayer,
    setPlayers,
    checkForWin,
  };
})();

// Player factory
const Player = (type, marker) => {
  return { type, marker };
};

// Display Control

const displayController = (() => {
  const displayMarkerOnClick = () => {
    const gameBoardArr = gameBoard.getGameboardArr();
    const mainGrid = document.querySelector(".main-grid");
    mainGrid.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell")) {
        gameBoard.populateBoardArr(e.target);
        gameBoard.switchMarker(e.target);
        displayMarker(e.target, gameBoardArr);
        let activePlayer = gameBoard.getCurrentPlayer();
        displayActivePlayer(activePlayer);
        gameBoard.checkForWin();
      }
    });
  };

  const displayMarker = (cell, gameBoardArr) => {
    for (let i in gameBoardArr) {
      if (
        +cell.getAttribute("data-number") - 1 === +i &&
        cell.textContent === ""
      ) {
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
  return { displayMarkerOnClick };
})();

displayController.displayMarkerOnClick();
