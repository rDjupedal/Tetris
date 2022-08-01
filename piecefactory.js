import PieceL from "./piece.js";
import {PieceL2, PieceBox, PieceT, PieceI} from "./piece.js";


export default class PieceFactory {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.numOfBlocks = 5;
    }

    createRndBlock() {
        let rnd = Math.floor(Math.random() * this.numOfBlocks);
        console.log(rnd);

        switch (rnd) {
            case(0):
                return new PieceL(this.gameWidth, this.gameHeight);
            case(1):
                return new PieceL2(this.gameWidth, this.gameHeight);
            case(2):
                return new PieceBox(this.gameWidth, this.gameHeight);
            case(3):
                return new PieceT(this.gameWidth, this.gameHeight);
            case(4):
                return new PieceI(this.gameWidth, this.gameHeight);
        }
    }
}