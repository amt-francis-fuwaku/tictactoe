//set player x | o
const user = JSON.parse(sessionStorage.getItem("user"));
const opponent = JSON.parse(sessionStorage.getItem("opponent"));

//destructuring
let [mask1, name1, move1] = user;
let [mask2, name2, move2] = opponent;

let winner = null; //let winner

let oMovement = [];
let xMovement = [];

//save and maintain the game after browser refresh
let tracker = [];

// switches current player
let playerTurnIndicator;

//set current player according to chosen mask
let currentPlayer;

//set score text base on the chosen player
if (user[1] === "playerO") {
    currentPlayer = opponent;
    document.getElementById("opponent").textContent = "(P1)";
    document.getElementById("you").textContent = "(P2)";
} else if (user[1] == "playerX") {
    currentPlayer = user;
    document.getElementById("you").textContent = "(P1)";
    document.getElementById("opponent").textContent = "(P2)";
}

//save game data
let saveData;

//registering html elements || game menu
const currentMask = document.getElementById("mask_turn");
const resetButton = document.getElementById("reset");

//registering html elements || game display board
const cells = Array.from(document.querySelectorAll("[data-cell]"));

//registering html elements || game modal display
//win modal
const winMOdal = document.getElementById("win_modal");
const displayModal = document.getElementById("modal");

// win modal call to action button
const quitButton = document.getElementById("quitButton");
const nextRoundButton = document.getElementById("nextRoundButton");
const winnerText = document.getElementById("winner");
const winnerMask = document.getElementById("winning_player_mask");
const takesText = document.getElementById("takes");
const tieText = document.getElementById("tie");

//rest modal
const resetModal = document.getElementById("restart_modal");
//reset cta button
const cancelButton = document.getElementById("cancel");
const restartButton = document.getElementById("restart");

//this get each players move
function getPlayerMove(boxID) {
    const validBox = currentPlayer === user || currentPlayer === opponent;
    if (validBox) {
        currentPlayer[2].push(parseInt(boxID));
    }
    return currentPlayer[2];
}

//tracks the status of the game
const checkGameStatus = (boxID, moves) => {
    //let winner
    winner = null;
    //wining combination
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

    let pMoves = getPlayerMove(boxID);
    for (const combination of WINNING_COMBINATIONS) {
        const isWinner = combination.every((com) => pMoves.includes(com));
        if (isWinner) {
            winner = currentPlayer[1];
        }
    }

    return {
        status:
            moves.length === 9 || winner != null ? "completed" : "in-progress",
        winner: winner,
    };
};

//get data number from scoreboard covert from string =>  number
let xScore = Number(document.getElementById("x_score").textContent);
let oScore = Number(document.getElementById("o_score").textContent);
let tieCount = Number(document.getElementById("tie_count").textContent);

//AVOIDS GAME STATE LOSS AFTER BROWSER REFRESH
function saveGameStateData() {
    saveData = {
        xScore,
        oScore,
        tieCount,
    };
    sessionStorage.setItem("gameStateData", JSON.stringify(saveData));
}

function getSavedGameData() {
    saveData = JSON.parse(sessionStorage.getItem("gameStateData"));
    return saveData;
}

//saves game data and state
const restoreGameState = () => {
    let gameSavedState = getSavedGameData();
    xScore = gameSavedState.xScore;
    tieCount = gameSavedState.tieCount;
    oScore = gameSavedState.oScore;
    //update to the Dom
    document.getElementById("x_score").textContent = xScore.toString();
    document.getElementById("tie_count").textContent = tieCount.toString();
    document.getElementById("o_score").textContent = oScore.toString();
};

//REGISTERING ALL CLICK EVENTS
//menu reset
resetButton.addEventListener("click", handleReset);
//quit game
quitButton.addEventListener("click", handleQuitGame);
//next round
nextRoundButton.addEventListener("click", handleNextRound);
//cancel game

cancelButton.addEventListener("click", () => {
    resetModal.classList.add("hidden");
});

//defining all click events call back function || handlers
//reset

//restart game
restartButton.addEventListener("click", () => {
    clearScreen();
    console.log("user array", user[2].length);
    console.log("opponent array", opponent[2].length);
});

// next round
function handleNextRound() {
    winMOdal.classList.add("hidden"); //hides modal box
    clearScreen();
    updateScores();

    // //reset each player already made move
    // user[2] = [];
    // opponent[2] = [];
}

function handleReset() {
    resetModal.classList.remove("hidden");
}

//modal cta
function handleQuitGame() {
    console.log("game quit");
}

//gameboard
cells.forEach((cell) => {
    cell.addEventListener("click", gamePlay, { once: true });
});

//clears screen
function clearScreen() {
    currentMask.setAttribute("src", "./assets/icon-gray-1.svg"); //reset
    cells.forEach((cell) => {
        tracker = []; //
        resetModal.classList.add("hidden");
        cell.classList.remove(user[0]);
        cell.classList.remove(opponent[0]);
        cell.removeEventListener("click", gamePlay, { once: true });
        cell.addEventListener("click", gamePlay, { once: true });
    });

    //reset each players move
    user[2] = [];
    opponent[2] = [];

    //reset player to initial state
    if (user[1] == "playerO") {
        currentPlayer = opponent;
    } else if (user[1] == "playerX") {
        currentPlayer = user;
    }
}

// CLICK  ACTION
function gamePlay(event) {
    const box = event.target; // get a single box
    placeMask(box, currentPlayer); //places player mask
    checkWinner(box.id, tracker);
    switchPlayers(); //switch turns
    console.log("from gameplay", currentPlayer);
}

//  RESTORING GAME STATE AFTER REFRESH
if (getSavedGameData()) {
    console.log("IM HERE AFTER EVERY REFRESH");
    restoreGameState();
}

//helper methods

//update games scores
const updateScores = () => {
    if (winner == "playerX") {
        xScore += 1;
    } else if (winner == "playerO") {
        oScore += 1;
    } else {
        tieCount += 1;
    }

    saveGameStateData(); // update players score || ties
    let savedData = getSavedGameData();
    document.getElementById("x_score").textContent = saveData.xScore;
    document.getElementById("tie_count").textContent = savedData.tieCount;
    document.getElementById("o_score").textContent = savedData.oScore;

    console.log(savedData);
    // console.log("o score", savedData.oScore);
    // console.log("tie count", savedData.tieCount);
};

//switch player
function switchPlayers() {
    if (currentPlayer == user) {
        currentPlayer = opponent;
    } else {
        currentPlayer = user;
    }

    playerTurnIndicator = currentPlayer[0] == "x" ? 1 : 0; //switching current mask
    console.log("current mask", playerTurnIndicator);
    currentMask.setAttribute(
        "src",
        `./assets/icon-gray-${playerTurnIndicator}.svg`
    );
    // console.log(currentPlayer);
    console.log(`current player :  ${currentPlayer[1]}`);

    return currentPlayer;
}
//places mask on each box
function placeMask(box, currentPlayer) {
    box.classList.add(currentPlayer[0]);
    tracker.push(currentPlayer[0]);
    box.style.background = "";
}
//on mouseenter enter effect
cells.forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
        //checks if a cell already contains a mask
        if (cell.classList.contains("x") || cell.classList.contains("circle")) {
            return;
        }

        if (currentPlayer[0] == "x") {
            cell.style.backgroundImage = "url(./assets/icon-x-outline.svg)";
        } else {
            cell.style.background = "url(./assets/icon-o-outline.svg)";
        }
        cell.style.backgroundRepeat = "no-repeat";
        cell.style.backgroundPosition = "50%";
    });
});
//on mouseleave effect
cells.forEach((cell) => {
    cell.addEventListener("mouseleave", () => {
        if (currentPlayer[0] == "x") {
            cell.style.background = "";
        } else {
            cell.style.background = "";
        }
    });
});
//checkWinner
const checkWinner = (id, tracker) => {
    let gameStatus = checkGameStatus(id, tracker); //test class  array list
    if (gameStatus.status === "completed") {
        winMOdal.classList.remove("hidden");
        let playerWinner = "";
        let takes = "";
        let pWinner;

        //displays winners mask in the modal
        let mask = gameStatus.winner === "playerX" ? "x" : "o";

        if (user[1] == "playerO") {
            pWinner = gameStatus.winner === "playerO" ? "1" : "2";
        }

        if (user[1] == "playerX") {
            pWinner = gameStatus.winner === "playerO" ? "2" : "1";
        }

        winnerMask.setAttribute("src", `./assets/icon-${mask}.svg`);

        if (gameStatus.winner) {
            takesText.style.color =
                gameStatus.winner === "playerX" ? "#31C3BD" : "#F2B137";
            winnerMask.classList.remove("hidden");
            playerWinner = `PLAYER ${pWinner} WINS!`;
            takes = "TAKES THE ROUND";
            tieText.classList.add("hidden");
        } else {
            tieText.textContent = "ROUND TIED";
            tieText.classList.remove("hidden");
            winnerMask.classList.add("hidden");
        }

        winnerText.textContent = playerWinner;
        takesText.textContent = takes;
        // console.log(mask);
        // console.log(gameStatus.winner, "wins!");
    }
};
/** */
