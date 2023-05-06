//set player x | o
const player1 = JSON.parse(localStorage.getItem("user"));
const player2 = JSON.parse(localStorage.getItem("opponent"));

//destructuring
const [mask1, name1] = player1;
const [mask2, name2] = player2;

// console.log(player2);
// console.log(mask2);
// console.log(name2);

//set current player according to chosen mask
let currentPlayer = name2 ? player2 : player1;
console.log(`current  ${currentPlayer}`);

//save game data
let saveGameState;

//set score text base on the chosen player
if (currentPlayer[1] == "playerO") {
    document.getElementById("you").textContent = "(P1)";
    document.getElementById("opponent").textContent = "(P2)";
}

//registering html elements || game menu
const currentMask = document.getElementById("mask_turn");
const resetButton = document.getElementById("reset");
//test
// console.log(currentMask);
// console.log(resetButton);

//registering html elements || game display board
