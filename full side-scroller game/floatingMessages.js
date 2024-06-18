export class FloatingMessage {
    constructor(value, x, y, targetX, targetY) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.timer = 0;
        this.markedToDelete = false;
    }
    update() {
        this.x += (this.targetX - this.x) * 0.03; // speed of messages decreases
        this.y += (this.targetY - this.y) * 0.03;
        this.timer++;
        if (this.timer > 100) this.markedToDelete = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "white";
        ctx.shadowBlur = 3;
        ctx.font = "20px Englebert";
        ctx.fillStyle = "red";
        ctx.fillText(this.value, this.x, this.y);
        ctx.restore();
    }
}