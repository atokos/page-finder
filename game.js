const context = document.querySelector("canvas").getContext("2d");
const linkContainer = document.getElementById("link");

const introContainer = document.getElementById("intro");
// introContainer.className = 'hidden'

const gameContainer = document.getElementById("game");
// gameContainer.className = 'hidden'

// const outroContainer = document.getElementById("game");
// outroContainer.className = 'hidden'

context.canvas.height = 400;
context.canvas.width = 1220;

// Start the frame count at 1
let frameCount = 1;
// Set the number of obstacles to match the current "level"
let obCount = 1;
// Create a collection to hold the generated x coordinates
let obXCoors = [];

let linkClicked = false;
let intro = false;
let borgen = false;
let outro = false;


const square = {
    height: 64,
    jumping: true,
    width: 64,
    x: 0,
    xVelocity: 0,
    y: 0,
    yVelocity: 0

};

const obsHeight = 32;
const obsWidth = 32;

const level = 1;

// Create the obstacles for each frame
const nextFrame = () => {
    // increase the frame / "level" count
    frameCount++;
    obCount++;
    obXCoors = []

    for (let i = 0; i < obCount; i++) {
        // Randomly generate the x coordinate for the top corner start of the triangles
        //const obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
        let obXCoor = (Math.floor(Math.random() * (32 - 0 + 1) + 0) * 32 + 140);
        while(true) {
            if (obXCoors.indexOf(obXCoor) === -1) {
                break;
            }
            obXCoor = (Math.floor(Math.random() * (32 - 0 + 1) + 0) * 32 + 140);
        }
        obXCoors.push(obXCoor);
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

function runOutro() {
    setTimeout(() => {
        console.log("picture 1")
    }, 1500)
    setTimeout(() => {
        console.log("picture 2")
    }, 1500)
    setTimeout(() => {
        console.log("picture 3")
    }, 1500)
    setTimeout(() => {
        resolve("done")
    }, 1500)
}

function checkController() {
    if (controller.up && square.jumping == false) {
        square.yVelocity -= 40;
        square.jumping = true;
    }

    if (controller.left) {
        square.xVelocity -= 1;
    }

    if (controller.right) {
        square.xVelocity += 1;
    }
}


function checkMap() {
    // if square is falling below floor line
    if (square.y > 386 - 16 - 64) {

        square.jumping = false;
        square.y = 386 - 16 - 64;
        square.yVelocity = 0;
    }

    // if square goes past left boundary
    if (square.x < 0) {
        square.x = 0;
    }

    // if square goes past right boundary
    if (square.x > 1220) {

        if (frameCount === 7) {
            outro = true;
        } else {
            square.x = -20;
            nextFrame();
        }
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
                square.x = obstX + obsWidth + 0.01;
                break;
            }

            if (this.xVelocity > 0) {
                square.x = obstX - square.width - 0.01;
                break;
            }
        }
    }

    square.yVelocity += 3;// gravity
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

            if (this.xVelocity > 0) {
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
        context.fillStyle = "#d6e9ee";
        context.fillRect(0, 0, 1220, 400); // x, y, width, height

        // Creates and fills the cube for each frame
        context.fillStyle = "#21130d"; // hex for cube color
        context.beginPath();
        context.rect(square.x, square.y, square.width, square.height);
        context.fill();

        // Create the obstacles for each frame
        context.fillStyle = "#eab676"; // hex for triangle color
        obXCoors.forEach((obXCoor) => {
            context.beginPath();
            context.rect(obXCoor, 400 - obsHeight - 30, obsHeight, obsWidth);
            context.fill();

            context.closePath();
            context.fill();
        })

        // Creates the "ground" for each frame
        context.strokeStyle = "#e28743";
        context.lineWidth = 30;
        context.beginPath();
        context.moveTo(0, 385);
        context.lineTo(1220, 385);
        context.stroke();
    }

    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);
};

function runIntro() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("picture 1")
        }, 1500)
        setTimeout(() => {
            console.log("picture 2")
        }, 3000)
        setTimeout(() => {
            console.log("picture 3")
        }, 4500)
        setTimeout(() => {
            resolve("done")
        }, 6000)
    })
}

async function doIntro() {
    linkClicked = true;
    intro = true;
    introContainer.className = "";
    linkContainer.className = linkContainer.className + "hidden"
    //const res = await runIntro()
    introContainer.className = introContainer.className + "hidden"
    intro = false;
    gameContainer.className = "";
}

linkContainer.addEventListener("click", () => doIntro())
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);