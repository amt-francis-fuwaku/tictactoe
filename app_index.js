// clear storage
sessionStorage.clear();
//defining html elements
const xButton = document.getElementById("x-box");
const oButton = document.getElementById("o-box");
const xMask = document.getElementById("x_mask_select");
const oMask = document.getElementById("o_mask_select");

//pre-defined css classes that holds  each svg || location gameplay.css
// player x
// player o
let oMovement = [];
let xMovement = [];
const Mask_O = ["circle", "playerO", oMovement];
const Mask_X = ["x", "playerX", xMovement];

//initial value
sessionStorage.setItem("user", JSON.stringify(Mask_O));
sessionStorage.setItem("opponent", JSON.stringify(Mask_X));

//select mask x
function selectX() {
    // x selected
    xButton.classList.add("selected_bg");
    xMask.classList.remove("unselected");
    xMask.classList.add("selected");

    // o unselected
    oMask.classList.remove("selected");
    oButton.classList.remove("selected_bg");
    oMask.classList.add("unselected");

    sessionStorage.setItem("user", JSON.stringify(Mask_X));
    sessionStorage.setItem("opponent", JSON.stringify(Mask_O));
    console.log("i clicked x");
}

//select mask o
function selectO() {
    // o selected
    oButton.classList.add("selected_bg");
    oMask.classList.remove("unselected");
    oMask.classList.add("selected");

    // x unselected
    xMask.classList.remove("selected");
    xButton.classList.remove("selected_bg");
    xMask.classList.add("unselected");

    sessionStorage.setItem("user", JSON.stringify(Mask_O));
    sessionStorage.setItem("opponent", JSON.stringify(Mask_X));
    console.log("i clicked o");
}

//select mask
xButton.addEventListener("click", selectX);
oButton.addEventListener("click", selectO);
