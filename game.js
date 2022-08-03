import PieceFactory from "./piece.js";
import SoundPlayer from "./soundPlayer.js";

export default class Game {
    constructor(canvas, gameWidth, gameHeight) {
        this.canvas = canvas; // for debug calculating mouse clicks coord
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.isRunning = false;
        this.currentPiece = '';
        this.deadBlocks = [];
        this.pieceFactory = new PieceFactory(this.gameWidth, this.gameHeight);
        this.blockSize = 50; // just a start value, gets overwritten when first piece is created
        this.audio = new SoundPlayer();
    }

    startStop() {
        console.log("startstop");
        this.isRunning = !this.isRunning;
        if (this.isRunning) this.audio.play("test");
    }

    update(input, timeStamp) {

        /** Check for p button press (start / stop) todo: remove? */
        let pauseKey = 'p';
        if (input.pressedKeys.indexOf(pauseKey) !== -1){
            input.pressedKeys.splice(input.pressedKeys.indexOf(pauseKey, 1));
            this.startStop();
        }

        /** if paused.. */
        if(!this.isRunning) return;

        /** The piece has just been removed, means it was killed due to impact, check for full rows
         * and create a new one */
        if (!this.currentPiece) {
            this.checkRows();
            this.currentPiece = this.pieceFactory.createRndBlock();
            this.blockSize = this.currentPiece.blockSize;

        /** The piece is alive */
        } else {
            this.currentPiece.update(input.pressedKeys, timeStamp, this.deadBlocks);
            if (!this.currentPiece.alive) {

                /** Move the blocks from the piece to deadBlocks */
                for (let i = 0; i < this.currentPiece.blocks.length; i++) {
                    this.deadBlocks.push(this.currentPiece.blocks[i]);
                }

                /** Check for gameover */
                for (let i = 0; i < this.deadBlocks.length; i++) {
                    if (this.deadBlocks[i].y <= 0) {
                        this.gameOver();
                        return;
                    }
                }

                this.currentPiece = '';
            }
        }

        /** Check if it is touched down */
        if (!this.currentPiece.alive)
            this.audio.play('touchdown');
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
            // console.log(`gameW: ${this.gameWidth} gameH: ${this.gameHeight} rowIndex: ${rowIndex} colIndex: ${colIndex}`);
            blocks[rowIndex][colIndex] = deadBlock;
        })

        return blocks;
    }

    checkRows() {

        let rows = Math.floor(this.gameHeight / this.blockSize);
        let fullRows = 0;

        let deadBlocksArray = this.createDeadBlocksArray();
        for (let row = deadBlocksArray.length - 1; row >= 0; row--) {
            let fullRow = true;
            deadBlocksArray[row].forEach(block => {
                if (block == 0) fullRow = false;
            })

            if (fullRow) {

                fullRows++;

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

        if (fullRows === 1) this.audio.play('explosion');
        else if (fullRows > 1) this.audio.play('big_explosion');

    }

}