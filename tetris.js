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

function animate(timeStamp) {
    ctx.clearRect(0,0,gameWidth, gameHeight);
    game.update();
    game.draw(ctx);
    //console.log(`${timeStamp}`);
    if (game.isRunning) requestAnimationFrame(animate);
}

game.testPieceRotate();
game.startStop();
//animate(0);