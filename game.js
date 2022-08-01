import PieceL from './piece.js';

export default class Game {
    constructor(ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isRunning = false;
        this.currentPiece = '';
        this.deadBlocks = [];

    }

    startStop() {
        this.isRunning = !this.isRunning;
    }

    update(input, timeStamp) {

        if (!this.currentPiece) {
            this.currentPiece = new PieceL(this.gameWidth, this.gameHeight);
        } else this.currentPiece.update(input.pressedKeys, timeStamp, this.deadBlocks);


    }

    draw(ctx) {
        if (this.currentPiece) this.currentPiece.draw(ctx);
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