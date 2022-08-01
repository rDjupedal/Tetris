export default class Block {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

    }

    draw(ctx) {
        ctx.fillStyle = '#FF00FF';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeStyle = '#000000';
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.stroke();
    }



}