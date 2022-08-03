import Block from "./block.js";

class Piece {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.size = gameWidth / 6;
        this.blockSize = this.size / 3;
        this.x = Math.floor(((this.gameWidth / this.blockSize) / 2)-1) * this.blockSize;
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
            if (this.blocks[i].x + offsetX * this.blocks[i].size < 0 ||
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

            /*
            rotated = [
                [this.piece[2][0], this.piece[1][0], this.piece[0][0]],
                [this.piece[2][1], this.piece[1][1], this.piece[0][1]],
                [this.piece[2][2], this.piece[1][2], this.piece[0][2]]
            ]
             */

            this.piece = rotated;
        }

        /** Centrera i arrayen */
        let minRow = this.piece.length;
        let maxRow=0;
        let minCol= this.piece[0].length;
        let maxCol=0;

        for (let row = 0; row < this.piece.length; row++) {
            for (let col = 0; col < this.piece[row].length; col++) {
                if (this.piece[row][col]) {
                    if (row > maxRow) maxRow = row;
                    if (row < minRow) minRow = row;
                    if (col > maxCol) maxCol = col;
                    if (col < minCol) minCol = col;
                }
            }
        }

        let freeLinesAbove = minRow;
        let freeLinesBelow = this.piece.length - maxRow - 1;
        let freeLinesLeft = minCol;
        let freeLinesRight = this.piece[0].length - maxCol - 1;

        console.log(`över: ${freeLinesAbove}  under:${freeLinesBelow}  vänster: ${freeLinesLeft}  höger: ${freeLinesRight}`);

        function move(piece, rowOffset, colOffset) {
            console.log(`move function row ${rowOffset} col ${colOffset}`);

            if (rowOffset > 0) rowOffset = Math.floor(y)
            else rowOffset = -Math.abs(Math.floor(rowOffset));


            console.log("in: " + piece);

            let rows = piece.length;
            let cols = piece[0].length;

            /** New empty array */
            let newArray = [];
            for (let row = 0; row < rows; row++) {
                let r = [];
                for (let col = 0; col < cols; col++) {
                    r.push(0);
                }
                newArray.push(r);
            }

            let up = false;
            if (rowOffset < 0) up = true;

            for (let moves = 0; moves < Math.abs(rowOffset); moves++) {
                //up or down
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {

                        let r;
                        if (up) r = row - 1;
                        else r = row + 1;

                        if (r < 0 || r >= rows) newArray[row][col] = 0;
                        else newArray[row][col] = piece[r][col];
                    }
                }
            }

            /*
            //down
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let r = row - 1;
                    if (r < 0 ) newArray[row][col] = 0;
                    else newArray[row][col] = piece[r][col];
                }
            }

            //up
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let r = row + 1;
                    if (r >= rows ) newArray[row][col] = 0;
                    else newArray[row][col] = piece[r][col];
                }
            }

             */


            /** Create an array bigger than original */
            /*
            let tempArray = []
            for (let row = 0; row < piece.length + 2; row++) {
                let r = [];
                for (let col = 0; col < piece[0].length + 2; col++) {
                    r.push(0);
                }
                tempArray.push(r);
            }
            console.log(tempArray);

             */

            /** Put the original array inside the new one */
            /*
            for (let row = 0; row < tempArray.length; row++) {
                for (let col = 0; col < tempArray[row].length; col++) {

                    let r = row - 1;
                    let c = col -1;

                    if (r >= 0 && c >= 0 && r < piece.length && c < piece[0].length) {
                        tempArray[row][col] = piece[r][c];
                    }
                    else tempArray[row][col] = 0;
                }
            }

             */

            /** From the bigger array use offsets to pick out what we want */
            /*
            let newArray = [];
            for (let row = 0; row < rows; row++) {
                let r = [];
                for (let col = 0; col < cols; col++) {
                    r.push(0);
                }
                newArray.push(r);
            }

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    newArray = tempArray[row + rowOffset][col + colOffset];
                }

            }

            console.log("new: " + newArray);

             */

            return newArray;
        }

        // too low
        if (freeLinesBelow < freeLinesAbove) {
            let diff = freeLinesAbove - freeLinesBelow;
            diff = Math.round(diff / 2);
            //console.log(diff);
            //this.piece = move(this.piece, 0, diff);
        }

        // too high
        if (freeLinesBelow > freeLinesAbove + 1) {
            let diff = freeLinesBelow - freeLinesAbove;
            diff = Math.round(diff / 2);

            //this.piece = move(this.piece, 0, diff);
        }

        /*
        if (Math.abs(freeLinesBelow - freeLinesAbove) >= 2) {
            //this.piece = move(this.piece, 0, Math.floor((freeLinesBelow - freeLinesAbove) / 2));
            this.piece = move(this.piece, 0, (freeLinesBelow - freeLinesAbove) / 2);
        }

        if (freeLinesBelow < freeLinesAbove) {
            this.piece = move(this.piece, 0, Math.round((freeLinesBelow-freeLinesAbove) / 2));
        }

         */


        /** Move all blocks to the left inside the piece if there's free space */
        /*
        let emptyFirstCol = true;

        while (emptyFirstCol) {
            emptyFirstCol = true;
            for (let row = 0; row < this.piece.length; row++) {
                if (this.piece[row][0]) emptyFirstCol = false;
            }

            if (emptyFirstCol) {
                console.log("moving left");
                for (let row = 0; row < this.piece.length; row++) {
                    for (let col = 0; col < this.piece[row].length; col++) {
                        let c = col + 1;
                        if (c >= this.piece[row].length) this.piece[row][col] = 0;
                        else this.piece[row][col] = this.piece[row][c];
                    }
                }
            }
        }

         */

        /*

        if (!this.piece[0][0] && !this.piece[1][0] && !this.piece[2][0]) {
            this.piece[0][0] = this.piece[0][1];
            this.piece[1][0] = this.piece[1][1];
            this.piece[2][0] = this.piece[2][1];

            this.piece[0][1] = this.piece[0][2];
            this.piece[1][1] = this.piece[1][2];
            this.piece[2][1] = this.piece[2][2];

            this.piece[0][2] = '';
            this.piece[1][2] = '';
            this.piece[2][2] = '';
        }

         */

        /** Move all blocks up if there's room inside the piece */
        /*
        if (!this.piece[0][0] && !this.piece[0][1] && !this.piece[0][2]) {
            console.log("moving up");
            for (let row = 0; row < this.piece.length - 1; row++) {
                for (let col = 0; col < this.piece[row].length; col++) {
                    this.piece[row][col] = this.piece[row + 1][col];
                }
            }
            this.piece[2][0] = '';
            this.piece[2][1] = '';
            this.piece[2][2] = '';
        }

         */


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
            }
            else if (this.blocks[i].x + this.blocks[i].size > this.gameWidth) {
                this.x -= this.blockSize;
                this.sideShifted = -1;
                //return;
            }

        }

        /** Check that new position doesn't collide with dead blocks or borders */

        if (!this.getFreeMove(0,0,deadBlocks)) {
            // Collision detected! Turn back the rotation!
            console.log("collision");
            this.piece = pieceOld;
            this.updateBlocks();
            return;
        }

    }


    update(keys, timeStamp, deadBlocks) {

        if (!this.alive) return;
        this.div.innerText = `x: ${this.x} y: ${this.y}`;

        /** Reacting to key inputs */
        if (timeStamp - this.updatedHoriz >= this.hRefreshInterval) {
            this.updatedHoriz = timeStamp;

            let key = keys.pop();
            if (key == 'ArrowUp') this.rotate('right', deadBlocks);


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

            if (key == 'd') {
                for (let row = 0; row < this.piece.length; row++) {
                    console.log(this.piece[row]);
                }
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

        this.piece = [
            [1,0,0],
            [1,0,0],
            [1,1,0]
        ]

        super.createBlocks(this.piece);
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

        super.createBlocks(this.piece);
    }
}

class PieceBox extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [1,1,0],
            [1,1,0],
            [0,0,0]
        ]

        super.createBlocks(this.piece);
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

        super.createBlocks(this.piece);
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

        super.createBlocks(this.piece);
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

        super.createBlocks(this.piece);
    }
}

class PieceI extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        this.piece = [
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0],
            [1,0,0,0]
        ]

        super.createBlocks(this.piece);
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

        rnd = 4;

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