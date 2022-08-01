class Piece {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.size = gameWidth / 6;
        this.x = gameWidth * 0.5 - this.size * 0.5;
        this.y = 0.1 * gameHeight - this.size * 0.5;
        this.blockSize = this.size / 3;
        this.rotation = 0;
        this.piece = [];
    }

    rotate(direction) {
        let turns = 0;
        let rotated;

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
    }

    drawBox(ctx, x, y) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(x, y, this.blockSize, this.blockSize);
        ctx.strokeStyle = '#000000';
        ctx.rect(x, y, this.blockSize, this.blockSize);
        ctx.stroke();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        for (let i = 0; i < this.piece.length; i++) {
            for (let j = 0; j < this.piece[i].length; j++) {
                if (this.piece[i][j] === 1) {
                    this.drawBox(ctx, j * this.blockSize, i * this.blockSize);
                }
            }
        }

        //debug border
        ctx.rect(0,0, 3 * this.blockSize, 3 * this.blockSize);

        ctx.stroke();
        ctx.restore();
    }
}

class Square extends Piece {
    constructor(gameWidth, gameHeight) {
        super(gameWidth, gameHeight);

        // Each piece consist of a 3x3 box
        this.piece = [
            [1,0,0],
            [1,0,0],
            [1,1,0]
        ]
    }



}

export default Square;