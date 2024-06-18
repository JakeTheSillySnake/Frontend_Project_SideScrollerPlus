import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./state.js";
import { Collision } from "./particles.js";
import { FloatingMessage } from "./floatingMessages.js";

export default class Player {
    constructor(game) {
        this.game = game; // reference main object
        this.image = document.getElementById("player");
        this.width = 100;
        this.height = 91.3;
        this.x = 50;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.frameX = 0;
        this.frameY = 5;
        this.maxFrame = 3;
        this.speed = 0;
        this.maxSpeed = 10;
        this.vy = 0;
        this.weight = 1;
        this.states = [new Sitting(this), new Running(this), new Jumping(this), new Falling(this), new Rolling(this), new Diving(this), new Hit(this)];
        this.currentState = this.states[0];
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.timeSinceFrame = 0;
    } 
    update(input, deltatime) {
        this.currentState.handleInput(input);
        this.checkCollision();

        // horizontal movement
        this.x += this.speed;
        if (input.includes("ArrowRight") && this.currentState != this.states[6]) this.speed = this.maxSpeed;
        else if (input.includes("ArrowLeft") && this.currentState != this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;
        if (this.x < 0) this.x = 0;
        else if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

        // sprite animation
        if (this.timeSinceFrame > this.frameInterval) {
            if (this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.timeSinceFrame = 0;
        } else this.timeSinceFrame += deltatime;
    }
    draw(ctx) {
        if (this.game.debug) {
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2 + 10, this.width/3, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(obj => {
            const dx = (obj.x + obj.width/2 - 20) - (this.x + this.width/2);
            const dy = (obj.y + obj.height/2) - (this.y + this.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy); 

            if (distance < this.width/3 + obj.width/3) {
                obj.markedToDelete = true;
                this.game.collisions.push(new Collision(this.game, obj.x + obj.width * 0.5, obj.y + obj.height * 0.5));
                if (this.currentState == this.states[4] || this.currentState == this.states[5]) {
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage("+1", obj.x, obj.y, 110, 50))
                } else {
                    this.setState(6);
                    this.game.lives--;
                }
            }
        })
    }
    restart() {
        this.x = 50;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.currentState = this.states[0];
        this.frameX = 0;
        this.maxFrame = 4;
        this.frameY = 5;
        this.game.speed = 0;
      }
}