// user objects loaded from storage
let user = JSON.parse(sessionStorage.getItem("user"));
let cpu = JSON.parse(sessionStorage.getItem("opponent"));

let saveData; // saves gameData
let classArray; // an array for saving the games ui after refresh

// set score area text and color
if (user[2] == "playerO") {
    document.getElementById("you").innerHTML = "O (YOU)";
    document.getElementById("you-rg").style.backgroundColor = user[1];
    document.getElementById("cpu").innerHTML = "X (CPU)";
    document.getElementById("cpu-rg").style.backgroundColor = cpu[1];
}

// turn icon functions
let turnIcon = document.getElementById("turn-icon-img");

const changeToUser = () => {
    turnIcon.src = user[3];
};

const changeToCpu = () => {
    turnIcon.src = cpu[3];
};

let userScore = Number(document.getElementById("player-score").innerHTML);
let tiesCount = Number(document.getElementById("ties-count").innerHTML);
let cpuScore = Number(document.getElementById("cpu-score").innerHTML);
const restartBtn = document.getElementById("restart-icon");
const confirmRestart = document.getElementById("restart");
const overlay = document.getElementById("overlay");
const cancelBtn = document.getElementById("cancel");
const boxes = document.querySelectorAll(".box");
let boxArr = Array.from(boxes);
const nextRound = document.getElementById("next-round");

// switches turn
let turn = user[2] == "playerX";

// BROWSER RELOAD SAVE FUNCTIONALITY START
function saveGameState() {
    // Call the `savedUI` function to save the UI state in the `classArray` variable
    savedUI();

    // Create an object called `saveData` with properties for userScore, turn, tiesCount, cpuScore, and classArray
    saveData = {
        userScore,
        turn,
        tiesCount,
        cpuScore,
        classArray,
    };

    // Convert the `saveData` object to a JSON string and store it in the "gameData" key of the sessionStorage object
    sessionStorage.setItem("gameData", JSON.stringify(saveData));
}

//restore game state and ui
function restoreGameState() {
    // Retrieve the saved game data from sessionStorage and parse it as JSON
    saveData = JSON.parse(sessionStorage.getItem("gameData"));

    // Restore the values of turn, userScore, tiesCount, and cpuScore from the saveData object
    turn = saveData.turn;
    userScore = saveData.userScore;
    tiesCount = saveData.tiesCount;
    cpuScore = saveData.cpuScore;

    // Iterate over each box in `boxArr`
    boxArr.forEach((box, index) => {
        // Add the corresponding class from saveData.classArray to each box
        box.classList.add(saveData.classArray[index]);
    });

    // Update the displayed scores in the UI
    document.getElementById("cpu-score").innerHTML = cpuScore.toString();
    document.getElementById("player-score").innerHTML = userScore.toString();
    document.getElementById("ties-count").innerHTML = tiesCount.toString();

    // Solve pc playing on every reload
    if (turn) {
        gameplay();
    } else {
        turn = true;
        gameplay();
        turn = !turn;
    }
}

// save data for class list
const savedUI = () => {
    // Create an empty array called `classArray`
    classArray = [];

    // Iterate over each box in `boxArr`
    boxArr.forEach((box) => {
        // Check if the box contains the class "playerX"
        if (box.classList.contains("playerX")) {
            // If it does, push the string "playerX" into `classArray`
            classArray.push("playerX");
        }
        // Check if the box contains the class "playerO"
        else if (box.classList.contains("playerO")) {
            // If it does, push the string "playerO" into `classArray`
            classArray.push("playerO");
        }
        // If the box doesn't contain either "playerX" or "playerO"
        else {
            // Push the string "a" into `classArray`
            classArray.push("a");
        }
        // Return the `classArray` array (this return statement is actually not necessary)
        return classArray;
    });
};

// BROWSER END

//get empty boxes
const getEmpty = () => {
    return boxArr.filter(
        (cell) =>
            !cell.classList.contains(user[2]) &&
            !cell.classList.contains(cpu[2])
    );
};

//WIN, LOSE AND TIED STATE
const WIN_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// check win
const checkWin = (playerMark) => {
    return WIN_COMBOS.some((combo) => {
        return combo.every((element) => {
            let winner = boxArr[element].classList.contains(playerMark);
            return winner;
        });
    });
};

// check if gameboard is full
const boardFull = () => {
    return boxArr.every(
        (box) =>
            box.classList.contains(user[2]) || box.classList.contains(cpu[2])
    );
};

// brings up restart state
const restartState = () => {
    document.getElementById("restart-ttr").innerHTML = "RESTART GAME?";
    document.getElementById("restart-ttr").style.color = "#A8BFC9";
    document.getElementById("restart-states").style.visibility = "visible";
    overlay.style.visibility = "visible";
};

restartBtn.addEventListener("click", restartState);

// restart game
confirmRestart.addEventListener("click", () => {
    clrScreen();
    saveGameState();
    gameplay();
});

// removes restart state
cancelBtn.addEventListener("click", () => {
    document.getElementById("restart-states").style.visibility = "hidden";
    overlay.style.visibility = "hidden";
});

//brings up tied State
const tiedState = () => {
    tiesCount += 1;
    document.getElementById("ties-count").innerHTML = tiesCount.toString();
    document.getElementById("state-text").innerHTML = "";
    document.getElementById("win-icon").innerHTML = "";
    document.getElementById("ttr").innerHTML = "ROUND TIED";
    document.getElementById("ttr").style.color = "#A8BFC9";
    document.getElementById("states-message").style.columnGap = "0px";
    document.getElementById("states").style.visibility = "visible";
    overlay.style.visibility = "visible";
};

//clears screen
const clrScreen = () =>
    boxArr.forEach((item) => {
        // Remove the classes belonging to the user and the CPU from each item
        item.classList.remove(user[2]);
        item.classList.remove(cpu[2]);

        // Hide the states and restart states elements
        document.getElementById("states").style.visibility = "hidden";
        document.getElementById("restart-states").style.visibility = "hidden";

        // Hide the overlay
        overlay.style.visibility = "hidden";

        // Add event listener to apply hover effect on mouseenter
        item.addEventListener("mouseenter", (user) => hover(item));

        // Reset the background color and background image of the item
        item.style.backgroundColor = "#1F3641";
        item.style.backgroundImage = "";
    });

// setting hovers

const hover = (item) => {
    // Check if the caller's class is "playerO"
    if (user[2] == "playerO") {
        // If it is, set the background image of the item to "url(./assets/icon-o-outline.svg)"
        item.style.backgroundImage = "url(./assets/icon-o-outline.svg)";
    } else {
        // Otherwise, set the background image of the item to "url(./assets/icon-x-outline.svg)"
        item.style.backgroundImage = "url(./assets/icon-x-outline.svg)";
    }

    // Set the background repeat and position of the item
    item.style.backgroundRepeat = "no-repeat";
    item.style.backgroundPosition = "50%";
};

const setHover = () => {
    // Get all empty cells
    getEmpty().forEach((cell) => {
        // Add event listeners to each cell
        cell.addEventListener("mouseenter", () => hover(cell));
        cell.addEventListener(
            "mouseleave",
            () => (cell.style.backgroundImage = "")
        );
    });
};

// create highlight on win icons
const winEffect = (caller) => {
    // Create an empty array to store the IDs of the boxes that contain the caller's class
    const winArr = [];

    // Iterate over each box in `boxArr`
    boxArr.forEach((box) => {
        // Check if the box contains the class specified by `caller`
        if (box.classList.contains(caller[2])) {
            // If it does, add the ID of the box to `winArr`
            winArr.push(Number(box.id));
        }
    });

    // Iterate over each combination in `WIN_COMBOS`
    WIN_COMBOS.forEach((combo) => {
        // Check if every element in the combination exists in `winArr`
        if (combo.every((e) => winArr.includes(e))) {
            // If all elements exist in `winArr`, apply the highlight effect to each box in the combination
            combo.forEach((item) => {
                boxArr[item].style.backgroundColor = caller[1];
                boxArr[item].style.backgroundImage = caller[4];
            });
        }
    });
};

// CPU Starts
const player = Players();

//return computer choice
function Players() {
    const machine = () => {
        // Generate a random index within the range of `boxArr` length
        let play = Math.floor(Math.random() * boxArr.length);

        // Check if the box at the generated index contains a class belonging to either the user or the CPU
        // If so, generate a new random index until a box without those classes is found
        while (
            boxArr[play].classList.contains(user[2]) ||
            boxArr[play].classList.contains(cpu[2])
        ) {
            play = Math.floor(Math.random() * boxArr.length);
        }

        // Add the CPU class to the box at the chosen index
        boxArr[play].classList.add(cpu[2]);

        // Check if the board is full and there is no winner for both the user and the CPU
        if (boardFull() && !checkWin(user[2]) && !checkWin(cpu[2])) {
            tiedState(); // Display tied state
            return; // Exit the function
        }

        // Add an event listener to remove background image when the mouse enters the box
        boxArr[play].addEventListener(
            "mouseenter",
            () => (boxArr[play].style.backgroundImage = "")
        );

        // Check if the CPU wins
        if (checkWin(cpu[2])) {
            winEffect(cpu); // Apply win effect
            cpuScore += 1; // Increment CPU score
            document.getElementById("cpu-score").innerHTML =
                cpuScore.toString(); // Update CPU score display
            document.getElementById("state-text").innerHTML =
                "OH NO, YOU LOST..."; // Update state text
            document.getElementById("ttr").innerHTML = "TAKES THIS ROUND"; // Update round text
            document.getElementById("states-message").style.columnGap = "24px"; // Adjust column gap
            document.getElementById("win-icon").innerHTML = cpu[0]; // Update win icon
            document.getElementById("ttr").style.color = cpu[1]; // Update round text color
            document.getElementById("states").style.visibility = "visible"; // Show states
            overlay.style.visibility = "visible"; // Show overlay
        }

        saveGameState(); // Save the game state
    };

    return { machine }; // Return an object with the `machine` method
}

function cpuChoice() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            player.machine();
            resolve();
        }, 900);
    });
}
// CPU ends

// checks if user has won
const checkUserWin = () => {
    if (checkWin(user[2])) {
        winEffect(user);
        userScore += 1;
        saveGameState();
        console.log("saved on user win");
        document.getElementById("player-score").innerHTML =
            userScore.toString();
        document.getElementById("state-text").innerHTML = "YOU WON!";
        document.getElementById("ttr").innerHTML = "TAKES THIS ROUND";
        document.getElementById("states-message").style.columnGap = "24px";
        document.getElementById("win-icon").innerHTML = user[0];
        document.getElementById("ttr").style.color = user[1];
        document.getElementById("states").style.visibility = "visible";
        overlay.style.visibility = "visible";
        return true;
    } else {
        return false;
    }
};

// removes hover on clicked box
function remove(evt) {
    evt.target.style.backgroundImage = "";
}

// USER starts
function userChoice(evt) {
    // Check if the clicked target does not have the class of the CPU player
    if (!evt.target.classList.contains(cpu[2])) {
        // Add the class of the user player to the clicked target
        evt.target.classList.add(user[2]);

        // Call the function to change the turn to the CPU player
        changeToCpu();
    } else {
        // If the clicked target already has the class of the CPU player, return and do nothing
        return;
    }

    // Add event listeners and remove event listener on the clicked target
    evt.target.addEventListener("mouseenter", remove);
    evt.target.removeEventListener("click", userChoice);

    // Check if the user has won the game
    if (checkUserWin()) {
        return;
    }

    // Check if the board is full and no player has won
    if (boardFull() && !checkWin(user[2]) && !checkWin(cpu[2])) {
        // Call the function to handle the tied state
        tiedState();
        return;
    }

    // Save the game state and log the data
    saveGameState();

    // Call the CPU's choice asynchronously, and then change the turn back to the user
    cpuChoice().then(() => changeToUser);
}

// player object
const play = {
    cells: getEmpty(),
    addEvt() {
        this.cells.forEach((cell) => {
            cell.addEventListener("click", userChoice);
        });
    },
    rmEvt() {
        this.cells.forEach((cell) => {
            cell.removeEventListener("click", userChoice);
        });
    },
};

// calls next round
nextRound.addEventListener("click", () => {
    turn = !turn;
    clrScreen();
    saveGameState();
    gameplay();
});

// game play
const gameplay = () => {
    // Call the `setHover` function to set hover effects on game boxes
    setHover();

    // Check the value of `turn` to determine the current player's turn
    if (turn) {
        // If it is the user's turn, call the `changeToUser` function to indicate the user's turn
        changeToUser();

        // Call the `play.addEvt` function to add event listeners for the user's moves
        play.addEvt();
    } else {
        // If it is the CPU's turn
        cpuChoice().then(() => {
            // Call the `changeToUser` function to indicate the user's turn
            changeToUser();

            // Call the `play.addEvt` function to add event listeners for the user's moves
            play.addEvt();
        });
    }
};

if (sessionStorage.getItem("gameData") !== null) {
    restoreGameState();
}
gameplay();
