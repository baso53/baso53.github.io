var numSquares = 6;
var colors = [];
var pickedColor;
var h1 = document.querySelector("h1");
var colorDisplay = document.getElementById("colorDisplay");
var resetButton = document.querySelector("#reset");
var messageDisplay = document.querySelector("#message");
var modeButtons = document.querySelectorAll(".mode");
var squares = document.querySelectorAll(".square");

init();

function init() {
    //mode buttons event listeners
    setUpModeButtons();
    setUpSquares();
    reset();
}

function setUpModeButtons() {
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener("click", function () {
            modeButtons[0].classList.remove("selected");
            modeButtons[1].classList.remove("selected");
            this.classList.add("selected");
            this.textContent === "Easy" ? numSquares = 3 : numSquares = 6;
            reset();
        });
    }
}

function setUpSquares() {
    for (var i = 0; i < squares.length; i++) {
        //add click listener to squares
        squares[i].addEventListener("click", function () {
            var clickedColor = this.style.backgroundColor;
            //if player is correct
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = "Correct!";
                changeColors(clickedColor);
                h1.style.backgroundColor = clickedColor;
                resetButton.textContent = "Play Again?";
            }
            else {
                this.style.backgroundColor = "#232323";
                messageDisplay.textContent = "Try Again!";
            }
        });
    }
}

function reset() {
    //generate all new colors
    colors = generateRandomColors(numSquares);
    //pick a new random colors form array
    pickedColor = pickColor();
    //change colorDisplay to match picked Color
    colorDisplay.textContent = pickedColor;
    //reset messageDisplay
    messageDisplay.textContent = "";
    //reset Play Again? to New Colors
    resetButton.textContent = "New colors";
    //change colors of squares
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
        squares[i].style.backgroundColor = colors[i];
    }
    h1.style.backgroundColor = "steelblue"
}

resetButton.addEventListener("click", function () {
    //generate all new colors
    colors = generateRandomColors(numSquares);
    //pick a new random colors form array
    pickedColor = pickColor();
    //change colorDisplay to match picked Color
    colorDisplay.textContent = pickedColor;
    //reset messageDisplay
    messageDisplay.textContent = "";
    //reset Play Again? to New Colors
    this.textContent = "New colors";
    //change colors of squares
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = colors[i];
    }
    h1.style.backgroundColor = "steelblue"
})

for (var i = 0; i < squares.length; i++) {
    //add click listener to squares
    squares[i].addEventListener("click", function () {
        var clickedColor = this.style.backgroundColor;
        //if player is correct
        if (clickedColor === pickedColor) {
            messageDisplay.textContent = "Correct!";
            changeColors(clickedColor);
            h1.style.backgroundColor = clickedColor;
            resetButton.textContent = "Play Again?";
        }
        else {
            this.style.backgroundColor = "#232323";
            messageDisplay.textContent = "Try Again!";
        }
    });
}

function changeColors(color) {
    //change each color to mach target color
    for (var i = 0; i < colors.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

function pickColor() {
    var randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

function generateRandomColors(num) {
    //make array
    var arr = [];
    //add num random colors to array
    for (var i = 0; i < num; i++) {
        //get random color and push into array
        arr.push(randomColor());
    }
    //return array
    return arr;
}

function randomColor() {
    //pick "red" from 0 to 255
    var r = Math.floor(Math.random() * 256);
    //pick "green" from 0 to 255
    var g = Math.floor(Math.random() * 256);
    //pick "blue" from 0 to 255
    var b = Math.floor(Math.random() * 256);

    return "rgb(" + r + ", " + g + ", " + b + ")";
}