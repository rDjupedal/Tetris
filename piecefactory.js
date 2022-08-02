import PieceL from "./piece.js";
import {PieceL2, PieceBox, PieceT, PieceS, PieceS2, PieceI} from "./piece.js";


export default class PieceFactory {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.numOfBlocks = 7;
    }

    createRndBlock() {
        let rnd = Math.floor(Math.random() * this.numOfBlocks);
        
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
            case(5):
                return new PieceS(this.gameWidth, this.gameHeight);
            case(6):
                return new PieceS2(this.gameWidth, this.gameHeight);
        }
    }
}