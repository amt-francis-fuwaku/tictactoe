const App = {
  //add players mask on click using css  class
  X_CLASS: "x",
  O_CLASS: "circle",

  state: {
    //moves
    moves: [],
  },

  //ALL selected  Html element
  elm: {
    //menu html elements
    nextPlayerContainer: document.querySelector(".player-turn"),
    playerTurnSvg: document.querySelector(".player"),
    resetButton: document.querySelector(".reset-button"),

    //game board html element
    gameboard: document.getElementById("gameboard"),
    cellElements: document.querySelectorAll("[data-cell]"),

    //defining game result html elements #note these are arrays

    // lightblue,gray,lightyellow results box
    resultDisplayBoxes: document.querySelectorAll(".info-box"),
    //shows winning player #p1 #p2 #com
    displayPlayerText: document.querySelectorAll(".display_player"),
    // total winnings of games played
    totalWins: document.querySelectorAll(".total-wins "),

    //modal box call to action element
    modalContainer: document.getElementById("modal_container"),
    playerWinnerText: document.getElementById("player_winner"),

    winnerDisplayModal: document.getElementById("winner_modal"),
    winnerMask: document.getElementById("winning_player_mask"),
    takesMessage: document.getElementById("takes_round"),
    tieMessage: document.getElementById("tie"),

    //modal button
    quitButton: document.getElementById("quitButton"),
    nextRoundButton: document.getElementById("nextRoundButton"),
  },
  //Initiate all elements
  init() {
    App.registerAllEvent();
  },
  //register all html element
  registerAllEvent() {
    App.elm.cellElements.forEach((cell) => {
      cell.addEventListener("click", App.handleClicked, { once: true });
    });

    //reset
    App.elm.resetButton.addEventListener("click", () => {
      App.refreshBoard();
    });

    //modal call to action events listeners
    //quit game
    App.elm.quitButton.addEventListener("click", () => {});

    //next round
    App.elm.nextRoundButton.addEventListener("click", (event) => {
      App.refreshBoard();
    });
  },

  //handleClicked
  handleClicked(event) {
    //access individual cell
    const singleCell = event.target;

    //get us the last move object
    const lastMove = App.state.moves.at(-1);
    const getOpposite = (playerId) => (playerId === 1 ? 2 : 1);

    //holds current playerMask
    const currentPlayer =
      App.state.moves.length === 0 ? 1 : getOpposite(lastMove.playerId);
    const currentPlayerMask = currentPlayer === 1 ? App.X_CLASS : App.O_CLASS;

    //place player mask
    App.placePlayerMask(singleCell, currentPlayerMask);

    //update player moves
    App.updateMovesAndUser(singleCell, currentPlayer);

    //switch player
    App.switchTurns(currentPlayer);
    //check winner
    App.checkWinner(App.state.moves);
  }, //end handle Clicked

  // handles reset | next round
  refreshBoard() {
    App.state.moves = [];
    App.elm.cellElements.forEach((cell) => {
      cell.classList.remove("x", "circle");
      cell.removeEventListener("click", App.handleClicked);
      cell.addEventListener("click", App.handleClicked, { once: true });
    });
    App.elm.modalContainer.classList.add("hidden");
  },

  //tracks game status
  getGameStatus(moves) {
    //player 1 move
    const P1_MOVES = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.cellId);

    //player 2 move
    const P2_MOVES = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.cellId);
    //

    //winning combinations

    const WINNING_COMBINATIONS = [
      //Rows
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      //Columns
      [3, 6, 9],
      [1, 4, 7],
      [2, 5, 8],
      //Diagonal
      [1, 5, 9],
      [3, 5, 7],
    ];

    //get the winner of the game
    let winner = null;
    // let player1WinningCombination = [];
    // let player2WinningCombination = null;

    WINNING_COMBINATIONS.forEach((combination) => {
      const P1Wins = combination.every((com) => P1_MOVES.includes(com));
      const P2Wins = combination.every((com) => P2_MOVES.includes(com));

      //checks which player wins if Not winner is Null for a tie
      if (P1Wins) {
        //set winner
        winner = 1;
        for (const num of P1_MOVES) {
        }
        console.log(P1_MOVES);
      }
      if (P2Wins) {
        //set winner
        winner = 2;
        console.log(P2_MOVES);
      }
    });

    return {
      status:
        moves.length === 9 || winner != null ? "completed" : "in-progress", // in-progress | completed
      winner, // 1/2 / null
    };
  },
  //check winner or tie
  checkWinner(moves) {
    const game = App.getGameStatus(moves);
    // console.log(game.status);

    // check winner
    if (game.status === "completed") {
      //displays modal box if there is a win or draw
      App.elm.modalContainer.classList.remove("hidden");
      let message = "";
      let takes = "";

      //displays winners mask in the modal
      let mask = game.winner === 1 ? "x" : "o";
      App.elm.winnerMask.setAttribute("src", `./assets/icon-${mask}.svg`);
      if (game.winner) {
        //changing  winner takes  text color

        App.elm.takesMessage.style.color =
          game.winner === 1 ? "#31C3BD" : "#F2B137";

        App.elm.winnerMask.classList.remove("hidden");

        message = `PLAYER ${game.winner} WINS!`;
        takes = "TAKES THE ROUND";

        App.elm.tieMessage.classList.add("hidden");
      } else {
        App.elm.tieMessage.textContent = "ROUND TIED";
        App.elm.tieMessage.classList.remove("hidden");
        App.elm.winnerMask.classList.add("hidden");
      }
      App.elm.playerWinnerText.textContent = message;
      App.elm.takesMessage.textContent = takes;
    }
    // console.log(game);
  },

  //update player moves
  updateMovesAndUser(singleCell, currentPlayer) {
    App.state.moves.push({
      cellId: +singleCell.id,
      playerId: currentPlayer,
    });
  },

  //place player mask
  placePlayerMask(cell, currentPlayerMask) {
    cell.classList.add(currentPlayerMask);
  },

  switchTurns(currentPlayer) {
    //switches current player

    App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;
    // console.log(curPlayer);
  },
}; //END APP

// import View from "./view.js";
//
// //APP NAME SPACE
//
// // //Application loads
// // window.addEventListener("load", App.init);
//
// function gameInit() {
//   const view = new View();
//   // next game
//   view.gamePlayerMovement((event) => {
//     view.handleClicked(event);
//   });
//
//   // next game
//   view.gameNextRound((event) => {
//     view.refreshBoard();
//   });
//
//   // reset game
//   view.gameResetEvent((event) => {
//     console.log("reset event");
//     console.log(event);
//   });
//
//   // quit game
//   view.gameQuit((event) => {
//     console.log("quit");
//     console.log(event);
//   });
// }
//
// window.addEventListener("load", gameInit);
