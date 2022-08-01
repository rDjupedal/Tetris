import Square from './piece.js';

const gameWidth = 500;
const gameHeight = 900;
const canvas = document.getElementById('canvas_id');
const ctx = canvas.getContext('2d');
canvas.width = gameWidth;
canvas.height = gameHeight;


let square = new Square(gameWidth,gameHeight);


square.draw(ctx);

square.y = 150;
square.rotate('right');
square.draw(ctx);

square.y = 250;
square.rotate('right');
square.draw(ctx);

square.y = 350;
square.rotate('left');
square.draw(ctx);

square.y = 450;
square.rotate('left');
square.draw(ctx);
