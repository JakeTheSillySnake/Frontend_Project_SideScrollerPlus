
import Player from "./player.js";
import InputHandler from "./input.js";
import Background from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import UI from "./utils.js";

window.addEventListener("load", function() {
  
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1400; 
    canvas.height = 500;
    let record = 0;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.background = new Background(this);
            this.UI = new UI(this);
            this.speed = 0;
            this.maxSpeed = 3;
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.enemyInterval = 1000;
            this.timeSinceEnemy = 0;
            this.debug = false; // press "d" to see hitboxes
            this.score = 0;
            this.maxParticles = 50;
            this.time = 0;
            this.maxTime = 60000;
            this.isGameOver = false;
            this.reqScore = 60;
            this.lives = 5;
            
        }
        update(deltatime) {
            this.time += deltatime;
            if (this.time > this.maxTime || this.lives <= 0) this.isGameOver = true;
            if (this.time )
            this.player.update(this.input.keys, deltatime);
            this.background.update();

            // handle enemies
            if (this.timeSinceEnemy > this.enemyInterval) {
                this.addEnemy();
                this.timeSinceEnemy = 0;
            } else this.timeSinceEnemy += deltatime;
            this.enemies.forEach(enemy => enemy.update(deltatime))
            this.enemies = this.enemies.filter(obj => !obj.markedToDelete); // delete if off screen
            
            // handle particles
            this.particles.forEach(particle => {
                particle.update();
            });
            this.particles = this.particles.filter(particle => !particle.markedToDelete);
            // not too many particles
            if (this.particles.length > this.maxParticles) this.particles = this.particles.slice(0, this.maxParticles);
            
            // handle collisions
            this.collisions.forEach(collision => {
                collision.update(deltatime);
            });
            this.collisions = this.collisions.filter(collision => !collision.markedToDelete);
            
            // handle floating messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedToDelete);
        }
        draw() {
            this.background.draw(ctx);
            this.UI.draw(ctx);
            this.player.draw(ctx);
            this.enemies.forEach(enemy => enemy.draw(ctx));
            this.particles.forEach(particle => particle.draw(ctx));
            this.collisions.forEach(collision => collision.draw(ctx));
            this.floatingMessages.forEach(message => message.draw(ctx));
            
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.4) this.enemies.push(new GroundEnemy(this)); // 50% chance
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timestamp) {
        const deltatime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        game.update(deltatime);
        if (!game.isGameOver) requestAnimationFrame(animate);
        else gameOver();
    }

    animate(0);

    function gameOver() {
        ctx.font = "90px Bangers";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER", game.width/2 + 3, game.height/2 + 3 - 30);
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER", game.width/2, game.height/2 - 30);
          
        ctx.font = "30px Englebert";
        ctx.fillStyle = "black";
        ctx.fillText("Press Enter to restart", game.width/2 + 1, 51);
        ctx.fillStyle = "white";
        ctx.fillText("Press Enter to restart", game.width/2, 50);

        window.addEventListener("keydown", e => {
            if (e.key === "Enter" && game.isGameOver) restartGame();
        });

        if (game.score >= game.reqScore) { // won
            ctx.font = "90px Bangers";
            ctx.fillStyle = "black";
            ctx.fillText("You smashed it!", game.width * 0.5 + 3, game.height * 0.5 + 53);
            ctx.fillStyle = "white";
            ctx.fillText("You smashed it!", game.width * 0.5, game.height * 0.5 + 50);
        } else { // lost
            ctx.font = "90px Bangers";
            ctx.fillStyle = "black";
            ctx.fillText("Don't give up!", game.width * 0.5 + 3, game.height * 0.5 + 53);
            ctx.fillStyle = "white";
            ctx.fillText("Don't give up!", game.width * 0.5, game.height * 0.5 + 50);
        }

        const button = document.createElement("button");
        button.innerText = "Restart";
        button.id = "button1";
        button.addEventListener("click", () => {
            restartGame();
        });
        document.body.appendChild(button);

        if (game.score > record) {
            record = game.score;
            ctx.font = "40px Bangers";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("New Record: " + record, game.width/2 + 1, game.height/2 - 120 + 1);
            ctx.fillStyle = "red";
            ctx.fillText("New Record: " + record, game.width/2, game.height/2 - 120);
        }
        
      }
        
    function restartGame() {
        game.player.restart(); 
        game.enemies = [];
        game.collisions = [];
        game.particles = [];
        game.floatingMessages = [];
        game.score = 0;
        game.isGameOver = false;
        game.time = 0;
        game.lives = 5;
        animate(0);
        document.getElementById("button1").remove(); 
      }
})
