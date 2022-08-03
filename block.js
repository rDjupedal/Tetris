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

        let checkX = this.x + ((offsetX + 0.5) * this.size);
        let checkY = this.y + ((offsetY + 0.5) * this.size);

        if (    checkX > block2.x && checkX < block2.x + block2.size &&
                checkY > block2.y && checkY < block2.y + block2.size ) {
            return true;
        }

        return false;
    }

}