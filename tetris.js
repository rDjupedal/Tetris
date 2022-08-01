import Game from "./game.js";
import InputHandler from "./input.js";

const gameWidth = 500;
const gameHeight = 900;
const canvas = document.getElementById('canvas_id');
const ctx = canvas.getContext('2d');
canvas.width = gameWidth;
canvas.height = gameHeight;

const game = new Game(ctx, gameWidth, gameHeight);
const input = new InputHandler(game);
let lastTime = 0;
let timeSinceUpdate = 0;

function animate(timeStamp) {

    let dTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, gameWidth, gameHeight);
    game.update(input, timeStamp);
    game.draw(ctx);
    console.log(game.isRunning);

     requestAnimationFrame(animate);
}

//game.testPieceRotate();
game.startStop();
animate(0);