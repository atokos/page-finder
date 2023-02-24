const context = document.querySelector("canvas").getContext("2d");

const linkContainer = document.getElementById("link");
const gameContainer = document.getElementById("game");
const outroContainer = document.getElementById("outro");
const title = document.getElementById("text");

context.canvas.height = 400;
context.canvas.width = 1220;

const crate = new Image();
const sack = new Image();
const stone = new Image();
const bag = new Image();
const playerRight = new Image();
const playerLeft = new Image();
const background1 = new Image();
const background2 = new Image();
const background3 = new Image();
const background4 = new Image();
const background5 = new Image();

crate.src = './assets/obs_crate.png';
sack.src = './assets/obs_sack.png';
stone.src = './assets/obs_stone.png';
bag.src = './assets/obs_albin.png';
playerRight.src = "./assets/player_right.png";
playerLeft.src = "./assets/player_left.png";
background1.src = "./assets/background1.png"
background2.src = "./assets/background2.png"
background3.src = "./assets/background3.png"
background4.src = "./assets/background4.png"


// Start the frame count at 1
let frameCount = 1;
// Set the number of obstacles to match the current "level"
let obCount = 0;
// Create a collection to hold the generated x coordinates
let obXCoors = [];

let linkClicked = false;
let intro = false;
let borgen = false;
let outro = false;

const square = {
    height: 96,
    jumping: true,
    width: 64,
    x: 0,
    xVelocity: 0,
    y: 0,
    yVelocity: 0
};

const obsHeight = 64;
const obsWidth = 64;

const level = 1;

// Create the obstacles for each frame
const nextFrame = () => {
    // increase the frame / "level" count
    frameCount++;
    obCount++;
    obXCoors = []
    obstacles = []

    for (let i = 0; i < obCount; i++) {
        // Randomly generate the x coordinate for the top corner start of the triangles
        //const obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
        let x = (Math.floor(Math.random() * (16 - 0 + 1) + 0) * 32 + 140);

        const obsNumber = Math.floor(Math.random() * (4 - 1) + 1)
        let object = crate;
        switch (obsNumber) {
            case 1:
                object = crate;
                break;
            case 2:
                object = stone;
                break;
            case 3:
                object = sack;
                break;
        }
        while(true) {
            if (obXCoors.indexOf(x) === -1) {
                break;
            }
            x = (Math.floor(Math.random() * (16 - 0 + 1) + 0) * 32 + 140);
        }
        let obstacle = {};
        obstacle.x = x;
        obstacle.image = object;
        //obstacles.push(obstacle);
        //obXCoors.push(x);
    }
}

const controller = {
    left: false,
    right: false,
    up: false,
    keyListener: function (event) {
        const key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
            case 37:// left key
                controller.left = key_state;
                break;
            case 38:// up key
                controller.up = key_state;
                break;
            case 39:// right key
                controller.right = key_state;
                break;
        }
    }
};

function checkController() {
    if (controller.up && square.jumping == false) {
        square.yVelocity -= 30;
        square.jumping = true;
    }

    if (controller.left) {
        square.xVelocity -= 0.75;
    }

    if (controller.right) {
        square.xVelocity += 0.75;
    }
}


function checkMap() {
    // if square is falling below floor line
    if (square.y > 386 - 16 - square.height) {

        square.jumping = false;
        square.y = 386 - 16 - square.height;
        square.yVelocity = 0;
    }

    // if square goes past left boundary
    if (square.x < 0) {
        square.x = 0;
    }

    // if square goes past right boundary
    if (square.x > 1220) {
        if (frameCount === 2) {
            title.innerText = "maybe it wandered out of agora?"
        }
        if (frameCount === 3) {
            title.innerText = "down the hill?"
        }
        if (frameCount === 4) {
            title.innerText = "B?"
        }
        if (frameCount === 5) {
            outro = true;
        } else {
            square.x = -20;
            nextFrame();
        }
    } else if (frameCount === 1) {
        nextFrame();
    }
}

function checkCollision() {
    const obstY = 400 - obsHeight - 30;

    square.x += square.xVelocity;
    square.xVelocity *= 0.9;// friction

    // horizontal collision
    for (let i = 0; i < obXCoors.length; i++) {
        const obstX = obXCoors[i]
        if (square.x < obstX + obsWidth &&
            square.x + square.width > obstX &&
            square.y < obstY + obsHeight &&
            square.y + square.height > obstY
        ) {
            if (square.xVelocity < 0) {
                square.xVelocity = 0;
                square.x = obstX + obsWidth + 0.01;
                break;
            }
            if (square.xVelocity > 0) {
                square.xVelocity = 0;
                square.x = obstX - square.width - 0.01;
                break;
            }
        }
    }

    square.yVelocity += 1.5;// gravity
    square.y += square.yVelocity;
    square.yVelocity *= 0.9;// friction

    // vertical collision
    for (let i = 0; i < obXCoors.length; i++) {
        const obstX = obXCoors[i]
        if (square.x < obstX + obsWidth &&
            square.x + square.width > obstX &&
            square.y < obstY + obsHeight &&
            square.y + square.height > obstY
        ) {
            if (square.yVelocity < 0) {
                square.yVelocity = 0;
                square.y = obstY + obsHeight + 0.01;
                break;
            }
            if (square.yVelocity > 0) {
                square.yVelocity = 0;
                square.jumping = false;
                square.y = obstY - square.height - 0.01;
                break;
            }
        }
    }
}

const loop = function () {
    if (linkClicked && !(intro || outro)) {
        checkController();
        checkCollision();
        checkMap();

        // Creates the backdrop for each frame
        // context.fillStyle = "#d6e9ee";
        // context.fillRect(0, 0, 1220, 400);
        console.log(frameCount);
        if (frameCount === 2) {
            context.drawImage(background1, 0, 0, 1220, 400);
        }
        else if (frameCount === 3) {
            context.drawImage(background2, 0, 0, 1220, 400);
        }
        else if (frameCount === 4) {
            context.drawImage(background3, 0, 0, 1220, 400);
        }
        else if (frameCount === 5) {
            context.drawImage(background4, 0, 0, 1220, 400);
        }

        // Creates and fills the cube for each frame
        if (square.xVelocity < 0) {
            context.drawImage(playerLeft, square.x, square.y, square.width, square.height);
        } else {
            context.drawImage(playerRight, square.x, square.y, square.width, square.height);
        }

        // Create the obstacles for each frame
        // obstacles.forEach((obstacle) => {
        //     context.drawImage(obstacle.image, obstacle.x, 400 - obsHeight - 30, obsHeight, obsWidth);
        // })
    }

    if (outro) {
        gameContainer.className = gameContainer.className + "hidden"
        outroContainer.className = "";
        document.body.className = "done";
    } else {
        // call update when the browser is ready to draw again
        window.requestAnimationFrame(loop);
    }
};

async function startGame() {
    linkClicked = true;
    linkContainer.className = linkContainer.className + "hidden"
    gameContainer.className = "";
}

linkContainer.addEventListener("click", () => startGame())
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);