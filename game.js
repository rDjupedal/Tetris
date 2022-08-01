import PieceL from './piece.js';
import PieceFactory from "./piecefactory.js";

export default class Game {
    constructor(ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isRunning = false;
        this.currentPiece = '';
        this.deadBlocks = [];
        this.pieceFactory = new PieceFactory(this.gameWidth, this.gameHeight);

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
            //this.currentPiece = new PieceL(this.gameWidth, this.gameHeight);
            this.currentPiece = this.pieceFactory.createRndBlock();
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
        //this.deadBlocks.splice(0, this.deadBlocks.length);
        this.deadBlocks = [];
        this.currentPiece = '';
        alert('Game over!');

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