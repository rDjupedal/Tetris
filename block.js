export default class Block {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        if (!color) this.color = '#FF00FF';
        else this.color = color;
    }

    draw(ctx) {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // ctx.beginPath();
        // ctx.moveTo(this.x + 1, this.y + 1);
        // ctx.lineTo(this.x + this.size - 1, this.y + 1);
        // ctx.lineTo(this.x + this.size - 1, this.y + this.size - 1);
        // ctx.lineTo(this.x + 1, this.y + this.size - 1);
        // ctx.lineTo(this.x + 1, this.y + 1);
        // ctx.stroke();


        ctx.strokeStyle = '#000000';
        ctx.strokeRect(this.x+1, this.y+1, this.size-1, this.size-1);
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    checkCollision(block2, offsetX, offsetY) {

        let checkX = this.x + ((offsetX + 0.5) * this.size);
        let checkY = this.y + ((offsetY + 0.5) * this.size);

        if (    checkX > block2.x && checkX < block2.x + block2.size &&
                checkY > block2.y && checkY < block2.y + block2.size ) {
            return true;
        }

        return false;
    }

}