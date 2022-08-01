import PieceL from './piece.js';

export default class Game {
    constructor(ctx, gameWidth, gameHeight) {
        this.ctx = ctx;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isRunning = false;
        this.blocks = [];
        this.currentPiece = '';

    }

    startStop() {
        this.isRunning = !this.isRunning;
    }

    update() {
        if (!this.currentPiece) {
            console.log('no current piece');
            this.currentPiece = new PieceL(this.gameWidth, this.gameHeight);
            //this.pieces.push(new PieceL(this.gameWidth, this.gameHeight));
        } else this.currentPiece.update();
    }

    draw(ctx) {
        if (this.currentPiece) this.currentPiece.draw(ctx);
        this.blocks.forEach(piece => {piece.draw(ctx);})
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