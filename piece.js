import Block from "./block.js";

class Piece {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.size = gameWidth / 6;
        this.blockSize = this.size / 3;
        this.x = Math.floor(((this.gameWidth / this.blockSize) / 2)-1) * this.blockSize;
        //this.y = 0.1 * gameHeight - this.size * 0.5;
        //this.y = 1 * this.blockSize;
        this.y = 0 - 3 * this.blockSize;
        this.piece = [];
        this.blocks = [];
        this.updatedHoriz = 0;
        this.updatedVert = 0;
        this.vRefreshInterval = 200;
        this.hRefreshInterval = 30;
        this.div = document.getElementById('tempdiv');
        this.sideShifted = 0;   // Keeps track of if the piece was moved to the side while rotating
        this.alive = true;

    }

    createBlocks(piece) {
        for (let i = 0; i < piece.length; i++) {

            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j]) {
                    //console.log(`new block: ${this.x + j * this.blockSize}, ${this.y + i * this.blockSize}`);
                    this.blocks.push(new Block(this.x + j * this.blockSize, this.y + i * this.blockSize, this.blockSize));
                }
            }
        }
    }

    updateBlocks() {
        let index = 0;
        for (let i = 0; i < this.piece.length; i++) {
            for (let j = 0; j < this.piece[i].length; j++) {
                if (this.piece[i][j] === 1) {
                    this.blocks[index].update(this.x + j * this.blockSize, this.y + i * this.blockSize);
                    index++;
                }
            }
        }
    }

    getArraySize() {
        let rows = 0;
        let cols = 0;
        for (let i = 0; i < this.piece.length; i++) {

            for (let j = 0; j < this.piece[i].length; j++) {
                if (this.piece[i][j]) {
                    if (i > rows) rows = i;
                    if (j > cols) cols = j;
                }
            }
        }

        return {rows, cols};
    }

    /**
     * Check whether current piece can freely move offset-steps
     * @param offsetX
     * @param offsetY
     * @param deadBlocks
     * @returns {boolean}
     */
    getFreeMove(offsetX, offsetY, deadBlocks) {

        for (let i = 0; i < this.blocks.length; i++) {

            /** Horizontal border collision check */
            if (
                this.blocks[i].x + offsetX * this.blocks[i].size < 0 ||
                this.blocks[i].x + (offsetX + 1) * this.blocks[i].size > this.gameWidth) {
                    console.log("horizontal border collision");
                    return false;
            }

            /** Vertical border collision check */
            if (this.blocks[i].y + (offsetY + 1) * this.blocks[i].size >= this.gameHeight) {
                this.alive = false;
                return false;
            }

            /** Dead blocks collision check */
            for (let j = 0; j < deadBlocks.length; j++) {
                console.log("Checking block " + j);
                if (this.blocks[i].checkCollision(deadBlocks[j], offsetX,offsetY)) {
                    if (offsetY === 1) this.alive = false;
                    return false;
                }
            }

        }

        return true;
    }

    rotate(direction, deadBlocks) {

        /** Rotate the array */
        let turns = 0;
        let rotated = [];

        if (direction === 'left') turns = 3;
        else if (direction ==="right") turns = 1;
        else return;

        for (let i = 0; i < turns; i++) {
            rotated = [
                [this.piece[2][0], this.piece[1][0], this.piece[0][0]],
                [this.piece[2][1], this.piece[1][1], this.piece[0][1]],
                [this.piece[2][2], this.piece[1][2], this.piece[0][2]]
            ]
            this.piece = rotated;
        }

        this.updateBlocks();

        /** Check whether the piece has been moved sideways by rotating */
        if (this.sideShifted === 1 && this.getFreeMove(-1, 0, deadBlocks)){
            this.x -= this.blockSize;
            this.sideShifted = 0;
        }

        if (this.sideShifted === -1 && this.getFreeMove(1, 0, deadBlocks)){
            this.x += this.blockSize;
            this.sideShifted = 0;
        }


        /** Border collision check */
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].x < 0) {
                this.x += this.blockSize;
                this.sideShifted = 1;
                return;
            }
            else if (this.blocks[i].x + this.blocks[i].size > this.gameWidth) {
                this.x -= this.blockSize;
                this.sideShifted = -1;
                return;
            }

        }

        //this.updateBlocks();
    }


    update(keys, timeStamp, deadBlocks) {

        if (!this.alive) return;
        this.div.innerText = `x: ${this.x} y: ${this.y}`;

        /** Reacting to key inputs */
        if (timeStamp - this.updatedHoriz >= this.hRefreshInterval) {
            this.updatedHoriz = timeStamp;

            let key = keys.pop();
            if (key == 'ArrowUp') this.rotate('left', deadBlocks);


            if (key == 'ArrowLeft' && this.getFreeMove(-1, 0, deadBlocks)){
                this.x -= this.blockSize;
                this.sideShifted = 0;
            }

            if (key == 'ArrowRight' && this.getFreeMove(1, 0, deadBlocks)) {
                this.x += this.blockSize;
                this.sideShifted = 0;
            }

            if (key == 'ArrowDown' && this.getFreeMove(0,1,deadBlocks)) {
                this.y += this.blockSize;
            }

            this.updateBlocks();
        }

        /** Falling down */
        if (timeStamp - this.updatedVert >= this.vRefreshInterval) {
            this.updatedVert = timeStamp;

            if (this.getFreeMove(0,1, deadBlocks)) this.y += this.blockSize;

            this.updateBlocks();

        }

    }

    draw(ctx) {
        this.blocks.forEach(block => {
            block.draw(ctx);
            ctx.strokeRect(this.x, this.y, 3 * this.blockSize, 3 * this.blockSize);

        })

    }
}

class PieceL extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        // Each piece consist of a 3x3 box
        this.piece = [
            [1,0,0],
            [1,0,0],
            [1,1,0]
        ]

        super.createBlocks(this.piece);

    }




}

export default PieceL;