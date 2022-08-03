import PieceL from './piece.js';
import PieceFactory from "./piece.js";

export default class Game {
    constructor(ctx, canvas, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.canvas = canvas; // for debug calculating mouse clicks coord
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isRunning = false;
        this.currentPiece = '';
        this.deadBlocks = [];
        this.pieceFactory = new PieceFactory(this.gameWidth, this.gameHeight);
        this.blockSize = 50; // just a start value, gets overwritten when first piece is created
    }

    startStop() {
        console.log("startstop");
        this.isRunning = !this.isRunning;

    }

    update(input, timeStamp) {

        if (input.pressedKeys.indexOf(' ') !== -1){
            input.pressedKeys.splice(input.pressedKeys.indexOf(' ', 1));
            this.startStop();
        }

        if(!this.isRunning) return;

        if (!this.currentPiece) {
            this.checkRows();
            //this.currentPiece = new PieceL(this.gameWidth, this.gameHeight);
            this.currentPiece = this.pieceFactory.createRndBlock();
            this.blockSize = this.currentPiece.blockSize;
        } else {
            this.currentPiece.update(input.pressedKeys, timeStamp, this.deadBlocks);
            if (!this.currentPiece.alive) {
                for (let i = 0; i < this.currentPiece.blocks.length; i++) {
                    this.deadBlocks.push(this.currentPiece.blocks[i]);
                    // Check for gameover
                    for (let i = 0; i < this.deadBlocks.length; i++) {
                        if (this.deadBlocks[i].y <= 0) {
                            this.gameOver();
                            return;
                        }
                    }

                }
                this.currentPiece = '';
            }
        }


    }

    draw(ctx) {
        if (this.currentPiece) this.currentPiece.draw(ctx);
        this.deadBlocks.forEach(block => {
            block.draw(ctx);
        })
    }

    gameOver() {
        this.deadBlocks = [];
        this.currentPiece = '';
        alert('Game over!');

    }

    debugMouseClick(event) {
        console.log(`click at X: ${event.x - this.canvas.getBoundingClientRect().x} Y: ${event.y - this.canvas.getBoundingClientRect().y}`);

    }

    checkRows() {
        let cols = Math.floor(this.gameWidth / this.blockSize);
        let rows = Math.floor(this.gameHeight / this.blockSize);

        // Checking from bottom and up
        for (let row = 0; row < rows; row++) {
            let y = this.gameHeight - 0.5 * (row + 1) * this.blockSize;

            for (let col = 0; col < cols; col++) {
                let x = 1.5 * (col + 1) * this.blockSize;
                let fullRow = true;
                this.deadBlocks.forEach(deadBlock => {
                    if (!deadBlock.checkPoint(x, y)) fullRow = false;
                    console.log(`row ${row} so far full? ${fullRow} Checking x ${x}, y ${y} in deadblock x ${deadBlock.x}, y ${deadBlock.y}` );
                })


                if (fullRow) console.log(`full row: ${row}`);
            }
        }

    }

    testPieceRotate() {
        let pieceL = new PieceL(this.gameWidth, this.gameHeight);

        pieceL.draw(this.ctx);

        pieceL.y = 150;
        pieceL.rotate('right');
        pieceL.draw(this.ctx);

        pieceL.y = 250;
        pieceL.rotate('right');
        pieceL.draw(this.ctx);

        pieceL.y = 350;
        pieceL.rotate('left');
        pieceL.draw(this.ctx);

        pieceL.y = 450;
        pieceL.rotate('left');
        pieceL.draw(this.ctx);

    }
}