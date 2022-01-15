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

  function setPlayerData() {
    const startingPage = document.querySelector(".starting-page");
    startingPage.addEventListener("click", (e) => {
      getPlayerData(e.target, players);
    });
  }

  function getPlayerData(item, players) {
    if (item.textContent === "Player" || item.textContent === "Bot") {
      const marker =
        item.parentElement.parentElement.firstElementChild.textContent;
      const type = item.textContent;
      styleSelectedButton(item);
      if (marker === "X") {
        players.playerOne = Player(type, marker);
      } else {
        players.playerTwo = Player(type, marker);
      }
    }
    console.log(players);
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

  return { setPlayerData, moveToGame, players };
})();

gameControl.setPlayerData();
gameControl.moveToGame();

// GameBoard
const gameBoard = (() => {
  const players = gameControl.players;
  let currentPlayer = players.playerOne;
  const gameBoardArr = [];
  const switchMarker = () => {
    if (currentPlayer === players.playerOne) {
      currentPlayer = players.playerTwo;
    } else {
      currentPlayer = players.playerOne;
    }
  };
  const populateBoardArr = (currentPlayer) => {
    gameBoardArr.push(currentPlayer.marker);
  };

  return { gameBoardArr, populateBoardArr, switchMarker, currentPlayer };
})();

// Player factory
const Player = (type, marker) => {
  return { type, marker };
};

// Display Control

const displayController = (() => {
  const displayMarkerOnClick = () => {
    const gameBoardArr = gameBoard.gameBoardArr;
    const mainGrid = document.querySelector(".main-grid");
    mainGrid.addEventListener("click", (e) => {
      if (e.target.classList.contains("grid-cell")) {
        let currentPlayer = gameBoard.currentPlayer;
        gameBoard.populateBoardArr(currentPlayer);
        gameBoard.switchMarker();
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
  return { displayMarkerOnClick };
})();

displayController.displayMarkerOnClick();
