//set player x | o
const player1 = JSON.parse(localStorage.getItem("user"));
const player2 = JSON.parse(localStorage.getItem("opponent"));

//destructuring
const [mask1, name1, move1] = player1;
const [mask2, name2, move2] = player2;

//save and maintain the game after browser refresh
let gamePlayInterfaceState = [];

//set current player according to chosen mask
let currentPlayer = name2 || name1 ? player2 : player1;

//save game data
let saveData;

function getPlayerMove(boxID) {
    const isOddBox = Number(boxID) % 2 !== 0;
    const isEvenBox = !isOddBox;
    // const play = currentPlayer[2];
    if (
        (currentPlayer === player1 && isOddBox) ||
        (currentPlayer === player2 && isEvenBox)
    ) {
        currentPlayer[2].push(parseInt(boxID));
    } else if (
        (currentPlayer === player1 && isEvenBox) ||
        (currentPlayer === player2 && isOddBox)
    ) {
        currentPlayer[2].push(parseInt(boxID));
    }
    return currentPlayer[2];
}

const checkGameStatus = (boxID, moves) => {
    let winner = null;
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

    const pMoves = getPlayerMove(boxID);

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

//get data number from scoreboard covert from string =>  number
let p1Score = Number(document.getElementById("you_score").textContent);
let p2Score = Number(document.getElementById("opponent_score").textContent);
let tieCount = Number(document.getElementById("tie_count").textContent);

//set score text base on the chosen player
if (currentPlayer[1] == "playerO") {
    document.getElementById("you").textContent = "(P1)";
    document.getElementById("opponent").textContent = "(P2)";
}

//AVOIDS GAME STATE LOSS AFTER BROWSER REFRESH
function saveGameStateData() {
    saveData = {
        p1Score,
        p2Score,
        tieCount,
        currentPlayer,
        gamePlayInterfaceState,
    };

    sessionStorage.setItem("gameStateData", JSON.stringify(saveData));
}

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
restartButton.addEventListener("click", () => {
    resetModal.classList.add("hidden");
});

//gameboard
cells.forEach((cell) => {
    cell.addEventListener("click", handlePlayerMove, { once: true });
});

//defining all click events call back function || handlers
//reset
function handleReset() {
    resetModal.classList.remove("hidden");
}

//modal cta
function handleQuitGame() {
    console.log("game quit");
}

// next round
function handleNextRound() {
    console.log("next round");
}

// player move
function handlePlayerMove(event) {
    const box = event.target; // get a single box

    placeMask(box, currentPlayer); //places player mask
    //test class  array list
    let gameStatus = checkGameStatus(box.id, gamePlayInterfaceState);

    console.log(gameStatus.status);

    if (gameStatus.status === "completed") {
        winMOdal.classList.remove("hidden");
        let playerWinner = "";
        let takes = "";
        console.log(gameStatus.winner, "wins!");
    }

    //switch turns
    switchPlayers();
}

//helper methods
function switchPlayers() {
    if (currentPlayer == player1) {
        currentPlayer = player2;
    } else {
        currentPlayer = player1;
    }
    // console.log(currentPlayer);
    console.log(`current player :  ${currentPlayer[1]}`);

    return currentPlayer;
}

//places mask on each box
function placeMask(box, currentPlayer) {
    box.classList.add(currentPlayer[0]);
    gamePlayInterfaceState.push(currentPlayer[0]);
    box.style.background = "";
}

//on hover enter effect
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

//on mouse leave
cells.forEach((cell) => {
    cell.addEventListener("mouseleave", () => {
        if (currentPlayer[0] == "x") {
            cell.style.background = "";
        } else {
            cell.style.background = "";
        }
    });
});

/** */
