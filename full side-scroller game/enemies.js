class Enemy {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.timeSinceFrame = 0;
        this.markedToDelete = false;
    }
    update(deltatime) {
        // movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.timeSinceFrame > this.frameInterval) {
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.timeSinceFrame = 0;
        } else this.timeSinceFrame += deltatime;

        // check if off screen
        if (this.x < -this.width) this.markedToDelete = true;
    }
    draw(ctx) {
        if (this.game.debug) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.image = document.getElementById("fly");
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = (Math.random() * 3 + 1);
        this.speedY = 0;
        this.maxFrame = 4;
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.1 + 0.1; // angle increases at this speed
    }
    update(deltatime) {
        super.update(deltatime);
        this.angle += this.angleSpeed;
        this.y += (Math.random() * 1 + 1) * Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById("plant");
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game) {
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.image = document.getElementById("spider-big");
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    update(deltatime) {
        super.update(deltatime);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY = -this.speedY;
        if (this.y < -this.height) this.markedToDelete = true;
    }
    draw(ctx) {
        super.draw(ctx);
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, 0);
        ctx.lineTo(this.x + this.width/2, this.y + 50);
        ctx.stroke();
    }
}