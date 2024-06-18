export default class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = "Englebert";
        this.livesImage = document.getElementById("lives");
    }
    draw(ctx) {
        ctx.save();
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "white";
        ctx.shadowBlur = 3;
        ctx.font = this.fontSize + "px " + this.fontFamily; 
        ctx.textAlign = "left";
        ctx.fillStyle = "black";
        //score
        ctx.fillText("Score: ", 20, 50);
        ctx.fillText("/" + this.game.reqScore, 140, 50);
        ctx.fillStyle = "red";
        ctx.fillText(this.game.score, 110, 50)

        // lives
        for (let i = 0; i < this.game.lives; i++) {
            ctx.drawImage(this.livesImage, 20 + 30 * i, 95, 25, 25);
        }

        //timer
        ctx.fillStyle = "black";
        ctx.font = 0.8 * this.fontSize + "px " + this.fontFamily; 
        ctx.fillText("Time: " + ((this.game.maxTime - this.game.time) * 0.001).toFixed(1), 20, 80);
        ctx.restore();
    }
}
