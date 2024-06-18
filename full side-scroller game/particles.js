class Particle {
    constructor(game) {
        this.game = game;
        this.markedToDelete = false;
    }
    update() {
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) this.markedToDelete = true;   
    }
}

export class Dust extends Particle {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 10 + 10;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = "rgba(0, 0, 0, 0.2)";
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
    }
}

export class Splash extends Particle {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = document.getElementById("fire");
        this.size = Math.random() * 50 + 100;
        this.speedX = Math.random() * 6 - 4; // in both directions
        this.speedY = Math.random() * 2 + 1;
        this.gravity = 0;
    } 
    update() {
        super.update();
        this.gravity += 0.1
        this.y += this.gravity;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

export class Fire extends Particle {
    constructor(game, x, y) {
        super(game);
        this.game = game;
        this.image = document.getElementById("fire");
        this.size = Math.random() * 50 + 50;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;
        this.angle = 0; // for rotation
        this.angleSpeed = Math.random() * 0.4 - 0.2;
    }
    update() {
        super.update();
        this.angle += this.angleSpeed;
        this.x += Math.sin(this.angle * 5); // make fire wobble horizontally
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y); // change rotation point to corner of fire img
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        ctx.restore();
    }
}

export class Collision {
    constructor(game, x, y) {
        this.game = game;
        this.image = document.getElementById("collision");
        this.spriteWidth = 100;
        this.spriteHeight = 90;
        this.sizeMod = Math.random() + 0.5;
        this.width = this.spriteWidth * this.sizeMod;
        this.height = this.spriteHeight * this.sizeMod;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.maxFrame = 4;
        this.frame = 0;
        this.markedToDelete = false;
        this.fps = 15;
        this.frameInterval = 1000/this.fps;
        this.timeSinceFrame = 0;
    }
    update(deltatime) {
        this.x -= this.game.speed;
        if (this.timeSinceFrame > this.frameInterval) {
            if (this.frame >= this.maxFrame) this.markedToDelete = true;
            else this.frame++;
            this.timeSinceFrame = 0;
        } else this.timeSinceFrame += deltatime;

    }
    draw(ctx) {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}