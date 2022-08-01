export default class Block {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(ctx) {
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    checkCollision(block2, offsetX, offsetY) {
        if (
            this.x + offsetX + this.size >= block2.x &&
            this.x + offsetX <= block2.x + block2.size &&
            this.y + offsetY + this.size >= block2.y &&
            this.y + offsetY <= block2.y + block2.size ) {
                return true;
            }

        return false;
    }



}