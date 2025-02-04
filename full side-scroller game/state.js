import { Dust, Fire, Splash } from "./particles.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(state) {
        this.state = state;
    }
}

export class Sitting extends State {
    constructor(player) {
        super("SITTING");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.maxFrame = 4;
        this.player.frameY = 5;
        this.player.game.speed = 0;
    }
    handleInput(input) {
        if (input.includes("ArrowLeft") || input.includes("ArrowRight")) this.player.setState(states.RUNNING);
        else if (input.includes("ArrowUp")) this.player.setState(states.JUMPING);
        else if (input.includes("Enter")) this.player.setState(states.ROLLING);
    }
}

export class Running extends State {
    constructor(player) {
        super("RUNNING");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 3;
        this.player.maxFrame = 8;
        this.player.game.speed = this.player.game.maxSpeed;
    }
    handleInput(input) {
        this.player.game.particles.unshift(new Dust(this.player.game, this.player.x + 50, this.player.y + this.player.height));
        if (input.includes("ArrowDown")) this.player.setState(states.SITTING);
        else if (input.includes("ArrowUp")) this.player.setState(states.JUMPING);
        else if (input.includes("Enter")) this.player.setState(states.ROLLING);
    }
}

export class Jumping extends State {
    constructor(player) {
        super("JUMPING");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 1;
        this.player.maxFrame = 6;
        if (this.player.onGround()) this.player.vy -= 25;
        this.player.game.speed = this.player.game.maxSpeed;
    }
    handleInput(input) {
        if (this.player.vy > 0) this.player.setState(states.FALLING);
        else if (input.includes("Enter")) this.player.setState(states.ROLLING);
        else if (input.includes("ArrowDown")) this.player.setState(states.DIVING);
    }
}

export class Falling extends State {
    constructor(player) {
        super("FALLING");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 2;
        this.player.maxFrame = 6;
        this.player.game.speed = this.player.game.maxSpeed;
    }
    handleInput(input) {
        if (this.player.onGround()) this.player.setState(states.RUNNING);
        else if (input.includes("ArrowDown")) this.player.setState(states.DIVING);
    }
}

export class Rolling extends State {
    constructor(player) {
        super("ROLLING");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 6;
        this.player.maxFrame = 6;
        this.player.game.speed = this.player.game.maxSpeed * 2;
    }
    handleInput(input) {
        this.player.game.particles.unshift(new Fire(this.player.game, this.player.x + this.player.width * 0.5, this.player.y + this.player.height * 0.5));
        if (!input.includes("Enter") && this.player.onGround()) this.player.setState(states.RUNNING);
        else if (!input.includes("Enter") && !this.player.onGround()) this.player.setState(states.FALLING);
        else if (input.includes("ArrowUp") && input.includes("Enter") && this.player.onGround()) this.player.setState(states.JUMPING);
        else if (input.includes("ArrowDown") && !this.player.onGround()) this.player.setState(states.DIVING);
    }
}

export class Diving extends State {
    constructor(player) {
        super("DIVING");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 6;
        this.player.maxFrame = 6;
        this.player.game.speed = 2;
        this.player.vy = 15;
    }
    handleInput(input) {
        this.player.game.particles.unshift(new Fire(this.player.game, this.player.x + this.player.width * 0.5, this.player.y + this.player.height));
        if (this.player.onGround()) {
            for (let i = 0; i < 30; i++) {
                this.player.game.particles.unshift(new Splash(this.player.game, this.player.x + 10, this.player.y - 10));
            }
        }
        if (input.includes("Enter") && this.player.onGround()) this.player.setState(states.ROLLING);   
        else if (this.player.onGround()) this.player.setState(states.RUNNING);
    }
}

export class Hit extends State {
    constructor(player) {
        super("HIT");
        this.player = player;
    }
    enter() {
        this.player.frameX = 0;
        this.player.frameY = 4 ;
        this.player.maxFrame = 10;
        this.player.game.speed = 0;
    }
    handleInput(input) {
        if (this.player.frameX >= 10 && this.player.onGround()) this.player.setState(states.RUNNING);
    }
}