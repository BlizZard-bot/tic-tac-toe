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

function returnToHomePage() {
  const returnBtn = document.querySelector(".return-btn");
  let destination = "home";
  returnBtn.addEventListener("click", changeScreen.bind(null, destination));
}

(function moveToGame() {
  const startGameBtn = document.querySelector(".start-game-btn");
  let destination = "game";
  startGameBtn.addEventListener("click", changeScreen.bind(null, destination));
})();

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
  } else if (destination === "game") {
    helpPrompt.classList.add("hidden");
    header.classList.add("hidden");
    startingPage.classList.add("hidden");
    startGameBtn.classList.add("hidden");
    gameSection.classList.remove("hidden");
    returnToHomePage();
  }
}
