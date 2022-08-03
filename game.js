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

    createDeadBlocksArray() {
        /** Create an empty array of all possible deadblock positions */
        let cols = Math.floor(this.gameWidth / this.blockSize);
        let rows = Math.floor(this.gameHeight / this.blockSize);

        let blocks = [];
        for (let row = 0; row < rows; row++) {
            let r = []
            for (let col = 0; col < cols; col++) {
                r.push(0);
            }
            blocks.push(r);
        }

        /** Populate the array */
        this.deadBlocks.forEach(deadBlock => {
            let colIndex = Math.floor((deadBlock.x + 0.5 * deadBlock.size) / deadBlock.size);
            let rowIndex = Math.floor((deadBlock.y + 0.5 * deadBlock.size) / deadBlock.size);
            // console.log(rowIndex + "  " + colIndex);
            console.log(`gameW: ${this.gameWidth} gameH: ${this.gameHeight} rowIndex: ${rowIndex} colIndex: ${colIndex}`);
            blocks[rowIndex][colIndex] = deadBlock;
        })

        return blocks;
    }

    checkRows() {

        let rows = Math.floor(this.gameHeight / this.blockSize);

        let deadBlocksArray = this.createDeadBlocksArray();
        for (let row = deadBlocksArray.length - 1; row >= 0; row--) {
            let fullRow = true;
            deadBlocksArray[row].forEach(block => {
                if (block == 0) fullRow = false;
            })

            if (fullRow) {

                /** Remove blocks from array*/
                deadBlocksArray[row].forEach(block => {
                    this.deadBlocks.splice(this.deadBlocks.indexOf(block),1);
                })

                /** Move down the remaining blocks */
                for (let rowA = row - 1; rowA >= 0; rowA--) {
                    deadBlocksArray[rowA].forEach(block => {
                        if(block != 0) block.y += block.size;
                    })
                }
            }
        }

        /** pause */
        /*
        // Checking from bottom and up
        for (let row = 0; row < rows; row++) {
            let y = this.gameHeight - ((0.5 + row) * this.blockSize);

            let fullRow = [];
            for (let i = 0; i < rows; i++) fullRow.push(0);
            let col;

            this.deadBlocks.forEach(deadBlock => {
                if (y >= deadBlock.y && y <= deadBlock + deadBlock.blockSize) {
                    // found one block
                    // determine x-position
                    col = Math.floor((deadBlock.x + deadBlock.blockSize) / deadBlock.blockSize);
                    fullRow[col] = 1;
                }
            })

            console.log(`row ${row}:  ${fullRow}`);

         */

            //let x = (0.5 + col) * this.blockSize;

            /*
            for (let col = 0; col < cols; col++) {
                let x = (0.5 + col) * this.blockSize;

                let fullRow = [];
                for (let i = 0; i < rows; i++) fullRow.push(0);

                this.deadBlocks.forEach(deadBlock => {
                    if (deadBlock.checkPoint(x, y)) {


                    }
                    console.log(`row ${row} so far full? ${fullRow} Checking x ${x}, y ${y} in deadblock x ${deadBlock.x}, y ${deadBlock.y}` );
                })


                if (fullRow) console.log(`full row: ${row}`);
            }

             */
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