import Block from "./block.js";

class Piece {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.blockSize = gameWidth / 10;
        this.x = Math.floor(((this.gameWidth / this.blockSize) / 2)-1) * this.blockSize;
        this.y = 0 - 3 * this.blockSize;
        this.piece = [];
        this.blocks = [];
        this.updatedHoriz = 0;
        this.updatedVert = 0;
        this.vRefreshInterval = 200;
        this.hRefreshInterval = 30;
        this.sideShifted = 0;   // Keeps track of if the piece was moved to the side while rotating
        this.alive = true;
        this.drawDebugBorder = true;
    }

    createBlocks(piece, color) {
        for (let i = 0; i < piece.length; i++) {

            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j]) {
                    //console.log(`new block: ${this.x + j * this.blockSize}, ${this.y + i * this.blockSize}`);
                    this.blocks.push(
                        new Block(
                            this.x + j * this.blockSize,
                            this.y + i * this.blockSize,
                            this.blockSize,
                            color));
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
            if (this.blocks[i].x + offsetX * this.blocks[i].size < 0 ||
                this.blocks[i].x + (offsetX + 1) * this.blocks[i].size > this.gameWidth) {
                return false;
            }

            /** Vertical border collision check */
            if (this.blocks[i].y + (offsetY + 1) * this.blocks[i].size > this.gameHeight) {
                return false;
            }

            /** Dead blocks collision check */
            for (let j = 0; j < deadBlocks.length; j++) {
                if (this.blocks[i].checkCollision(deadBlocks[j], offsetX, offsetY)) {
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

        /** Initiate an empty array */
        let rotated = [];
        for (let i = 0; i < this.piece.length; i++) {
            let row = [];
            for (let j = 0; j < this.piece[i].length; j++) {
                row.push('');
            }
            rotated.push(row);
        }


        if (direction === "left") turns = 3;
        else if (direction === "right") turns = 1;
        else return;

        // todo: should make a safe copy of the array, not of reference?
        let pieceOld = this.piece;

        /** Rotate the array */
        for (let i = 0; i < turns; i++) {

            for (let row = 0; row < this.piece.length; row++) {
                for (let col = 0; col < this.piece[i].length; col++) {
                    let cols = this.piece[i].length;
                    let c = cols - col - 1;
                    rotated[row][col] = this.piece[c][row];
                }
            }

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
                //return;
                this.updateBlocks();
            }
            else if (this.blocks[i].x + this.blocks[i].size > this.gameWidth) {
                this.x -= this.blockSize;
                this.sideShifted = -1;
                //return;
                this.updateBlocks();
            }

        }

        /** Check that new position doesn't collide with dead blocks or borders */
        if (!this.getFreeMove(0,0,deadBlocks)) {
            // Collision detected! Turn back the rotation!
            console.log("collision");
            this.piece = pieceOld;
            this.updateBlocks();
        }

    }

    update(keys, timeStamp, deadBlocks) {

        if (!this.alive) return;

        /** Reacting to key inputs */
        if (timeStamp - this.updatedHoriz >= this.hRefreshInterval) {
            this.updatedHoriz = timeStamp;

            let key = keys.pop();

            switch(key) {
                case 'ArrowUp':
                    this.rotate('right', deadBlocks);
                    break;

                case 'ArrowLeft':
                    if (this.getFreeMove(-1, 0, deadBlocks)) {
                        this.x -= this.blockSize;
                        this.sideShifted = 0;
                    }
                    break;

                case 'ArrowRight':
                    if (this.getFreeMove(1, 0, deadBlocks)) {
                        this.x += this.blockSize;
                        this.sideShifted = 0;
                    }
                    break;

                case 'ArrowDown':
                    if (this.getFreeMove(0,1, deadBlocks)) {
                        this.y += this.blockSize;
                    } else {
                        this.alive = false;
                    }
                    break;

                case ' ':       // (space) Power down
                    while(this.getFreeMove(0,1, deadBlocks)) {
                        this.y += this.blockSize;
                        this.updateBlocks();
                    }
                    this.alive = false;
                    break;

                case 'd':
                    for (let row = 0; row < this.piece.length; row++) {
                        console.log(this.piece[row]);
                    }
                    break;
            }

            //this.updateBlocks();
        }

        /** Falling down */
        if (timeStamp - this.updatedVert >= this.vRefreshInterval) {
            this.updatedVert = timeStamp;

            if (this.getFreeMove(0,1, deadBlocks)) {
                this.y += this.blockSize;
                //this.updateBlocks();
            } else {
                this.alive = false;
            }

            //this.updateBlocks();

        }

        this.updateBlocks();
    }

    draw(ctx) {
        this.blocks.forEach(block => {
            block.draw(ctx);
            if (this.drawDebugBorder)
                ctx.strokeRect(this.x, this.y, this.piece.length * this.blockSize, this.piece[0].length * this.blockSize);
        })

    }
}

class PieceL extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [1,0,0],
            [1,0,0],
            [1,1,0]
        ]

        this.color = '#c753c5';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceL2 extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [0,1,0],
            [0,1,0],
            [1,1,0]
        ]

        this.color='#3a3af6';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceBox extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [1,1],
            [1,1]
        ]

        this.color = 'yellow';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceT extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ]

        this.color = 'purple';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceS extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ]

        this.color = '#3fa106';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceS2 extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [0,1,0],
            [1,1,0],
            [1,0,0],
        ]

        this.color = 'red';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceI extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ]

        this.color = '#077db0';

        super.createBlocks(this.piece, this.color);
    }
}

class PieceDot extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [[1]];
        this.color = 'grey';

        super.createBlocks(this.piece, this.color);
    }
}

export default class PieceFactory {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.numOfBlocks = 7;
    }

    createRndBlock() {
        let rnd = Math.floor(Math.random() * this.numOfBlocks);

        //rnd = 4;
        //return new PieceDot(this.gameWidth, this.gameHeight);

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