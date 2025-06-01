"use strict";

// import from Main.js as arguments
let parameters;
let globalLinks;

export default class GumboController {
    constructor(_parameters, _globalLinks) {
        parameters = _parameters;
        globalLinks = _globalLinks;
        this.gumboCounter = 0;
        this.gumbos = [];
        for (let i = 0; i < 3; i++) {
            this.gumbos.push(new Gumbo());
        }
        this.gumboBig = new GumboBig();
    }
    update() {
        this.gumboBig.update();
        this.gumbos.forEach(g => g.update());

        if (Math.random() < parameters.gumboAppearingRate) { this.appearGumbo(); }
        if (this.gumboCounter > parameters.gumboBigCountTimer) {
            if (Math.random() < parameters.gumboBigAppearingRate) { this.appearGumboBig(); }
        }
    }
    reset() {
        this.gumbos.forEach(g => { g.state = new GumboOffState(); });
        this.gumboBig.state = new GumboOffState();
        this.gumboCounter = 0;
    }
    appearGumbo() {
        let index = this.gumbos.findIndex(g => g.checkIfReadyToInitialize());
        if (index != -1) {
            this.gumbos[index].initialize();
            this.gumboCounter++;
        }                    
    }
    appearGumboBig() {
        if (this.gumboBig.checkIfReadyToInitialize()) {
            this.gumboBig.initialize();
            this.gumboCounter = 0;
        }
    }
}

class Gumbo {
    constructor() {
        this.hp = 0;
        this.power = 0;
        this.x = 300;
        this.y = 0;
        this.state = new GumboOffState();
        this.animationCount = 0;
        this.animationSpeed = 10;
        this.animationImages = [document.getElementById("gumboFront1"), 
                                document.getElementById("gumboFront2")];
        this.animationId = 0;
        this.surprisedImage = document.getElementById("gumboSurprise");
    }
    initialize() {
        let x = Math.random() < 0.5 ? -300 : 300;
        this.x = x;
        this.y = 0;
        this.hp = parameters.gumboHp;
        this.power = parameters.gumboPower;
        this.state = new GumboAppearingState(this);
        this.animationCount = 0;
        this.animationId = 0;
    }
    checkIfReadyToInitialize() {
        return this.state instanceof GumboOffState;
    }
    attack(carrot) {
        carrot.getAttacked(this);
    }
    getAttacked(beam) {
        if (this.state instanceof GumboAppearingState ||
            this.state instanceof GumboWaitingState ||
            this.state instanceof GumboDashState)
        {
            // Attack from behind would be a critical hit!
            if (this.state instanceof GumboDashState) {
                if ((this.state.speed > 0 && beam.speed > 0) ||
                    (this.state.speed < 0 && beam.speed < 0))
                {
                    this.hp = 0;
                    globalLinks.scoreController.getScore(this.x, this.y, parameters.scoreGumboFromBehind, parameters.colorScoreGumboFromBehind);
                    this.state = new GumboSurpriseState(this);
                } 
            } else {
                this.hp -= beam.power;
                if (this.hp <= 0) {
                    globalLinks.scoreController.getScore(this.x, this.y, parameters.scoreGumbo, parameters.colorScoreGumbo);
                    this.state = new GumboSurpriseState(this);
                }
            }

            return true;
        }
        return false;
    }
    getAstonished() {
        if (this.state instanceof GumboAppearingState ||
            this.state instanceof GumboWaitingState ||
            this.state instanceof GumboDashState)
        {
            this.hp = 0;
            globalLinks.scoreController.getScore(this.x, this.y, parameters.scoreGumboFromBehind * 100, parameters.colorScoreGumbo);
            this.state = new GumboSurpriseState(this);
        }
    }
    update() {
        this.state.update();
    }
    draw() {
        if (this.animationCount++ > this.animationSpeed) {
            this.animationId = (this.animationId + 1) % this.animationImages.length;
            this.animationCount = 0;
        }
        globalLinks.renderController.drawCharacter(this.animationImages[this.animationId], this.x, this.y);
    }
    drawSurprisedImage() {
        this.animationCount++;
        if (this.animationCount % 3 != 0) {
            globalLinks.renderController.drawCharacter(this.surprisedImage, this.x, this.y);
        }
    }
}

class GumboBig extends Gumbo {
    constructor() {
        super();
        this.animationImages = [document.getElementById("gumboBigFront1"), 
                                document.getElementById("gumboBigFront2")];
        this.surprisedImage = document.getElementById("gumboBigSurprise");
    }
    initialize() {
        let x = Math.random() < 0.5 ? -250 : 250;
        this.x = x;
        this.y = 0;
        this.hp = parameters.gumboBigHp;
        this.power = parameters.gumboBigPower;
        this.state = new GumboBigDashState(this);
        this.animationCount = 0;
        this.animationId = 0;
    }
    getAttacked(beam) {
        if (this.state instanceof GumboBigDashState)
        {
            this.hp -= beam.power;
            if (this.hp <= 0) {
                globalLinks.scoreController.getScore(this.x, this.y, parameters.scoreGumboBig, parameters.colorScoreGumboBig);
                this.state = new GumboSurpriseState(this);
            }
            return true;
        }
        return false;
    }
    getAstonished() {
        if (this.state instanceof GumboBigDashState)
        {
            this.hp = 0;
            globalLinks.scoreController.getScore(this.x, this.y, parameters.scoreGumboBig * 100, parameters.colorScoreGumboBig);
            this.state = new GumboSurpriseState(this);
        }
    }
    draw() {
        if (this.animationCount++ > this.animationSpeed) {
            this.animationId = (this.animationId + 1) % this.animationImages.length;
            this.animationCount = 0;
        }
        globalLinks.renderController.drawBigCharacter(this.animationImages[this.animationId], this.x, this.y);
    }
    drawSurprisedImage() {
        this.animationCount++;
        if (this.animationCount % 3 != 0) {
            globalLinks.renderController.drawBigCharacter(this.surprisedImage, this.x, this.y);
        }
    }
}

class GumboState {
    constructor(gumbo) {
        this.gumbo = gumbo;
    }
    update() {

    }
}

class GumboOffState extends GumboState {
    constructor() {
        super(NaN);
    }
    update() {
        return;
    }
}

class GumboAppearingState extends GumboState {
    constructor(gumbo) {
        super(gumbo);
        this.speed = parameters.gumboAppearingSpeed;
        gumbo.animationSpeed = 10;
    }
    update() {
        if (this.gumbo.x > 115) {
            this.gumbo.x -= this.speed;
        }
        else if (this.gumbo.x < -115) {
            this.gumbo.x += this.speed;
        }
        else {
            this.gumbo.state = new GumboWaitingState(this.gumbo);
        }
        this.gumbo.draw();
    }
}

class GumboWaitingState extends GumboState {
    constructor(gumbo) {
        super(gumbo);
        this.counter = 0;
    }
    update() {
        this.gumbo.draw();
        if (this.counter++ < parameters.gumboWaitingFrames) {
            return;
        }
        if (Math.random() < parameters.gumboSortieRate) {
            this.gumbo.state = new GumboDashState(this.gumbo);
        }
    }
}

class GumboDashState extends GumboState {
    constructor(gumbo) {
        super(gumbo);
        this.speed = gumbo.x > 0 ? -parameters.gumboDashSpeed : parameters.gumboDashSpeed;
        this.isJumpedOver = false;
        gumbo.animationSpeed = 1;
    }
    update() {
        const formerX = this.gumbo.x;
        this.gumbo.x += this.speed;
        this.gumbo.draw();

        if (!this.isJumpedOver) {
            const carrot = globalLinks.carrot;
            if (checkCollision(this.gumbo, carrot)) {
                // bump!
                this.gumbo.attack(carrot);
            } else {
                if (carrot.checkIfActive()) {
                    const relativeX0 = formerX - carrot.x;
                    const relativeX1 = this.gumbo.x - carrot.x;
                    if (Math.sign(relativeX0) != Math.sign(relativeX1)) {
                        // excellent jump!
                        globalLinks.scoreController.getScore(this.gumbo.x, this.gumbo.y, parameters.scoreGumboGetJumpedOver, parameters.colorScoreGumboGetJumpedOver);
                        this.isJumpedOver = true;
                    }
                }
            }
        }

        if (this.gumbo.x < -260 || this.gumbo.x > 260) {
            this.gumbo.state = new GumboOffState();
        }
    }
}

class GumboSurpriseState extends GumboState {
    constructor(gumbo) {
        super(gumbo);
        this.count = 0;
        this.speedX = gumbo.x > globalLinks.carrot.x ? parameters.gumboSurprisedSpeedX : -parameters.gumboSurprisedSpeedX;
        this.speedY = parameters.gumboSurprisedSpeedY;
    }
    update() {
        this.gumbo.x += this.speedX;
        this.gumbo.y += this.speedY;

        if (this.gumbo.y <= 0) {
            this.gumbo.y = 0;
            this.speedX = 0;
            this.speedY = 0;
        } else {
            this.speedY -= parameters.gumboSurprisedGravity;
        }

        this.gumbo.drawSurprisedImage();

        if (this.count++ > parameters.gumboSurprisedFrames) {
            this.gumbo.state = new GumboRetreatState(this.gumbo);
        }
    }
}

class GumboRetreatState extends GumboState {
    constructor(gumbo) {
        super(gumbo);
        this.speed = gumbo.x > globalLinks.carrot.x ? parameters.gumboRetreatSpeed : -parameters.gumboRetreatSpeed;
        gumbo.animationSpeed = 1;
    }
    update() {
        this.gumbo.x += this.speed;
        this.gumbo.draw();
        if (this.gumbo.x < -260 || this.gumbo.x > 260) {
            this.gumbo.state = new GumboOffState();
        }
    }
}

class GumboBigDashState extends GumboState {
    constructor(gumbo) {
        super(gumbo);
        this.speed = gumbo.x > 0 ? -parameters.gumboBigDashSpeed : parameters.gumboBigDashSpeed;
        gumbo.animationSpeed = 1;
    }
    update() {
        const formerX = this.gumbo.x;
        this.gumbo.x += this.speed;
        this.gumbo.draw();

        if (checkCollisionBigX(this.gumbo, globalLinks.carrot)) {
            // bump!
            this.gumbo.attack(globalLinks.carrot);
        }

        if (this.gumbo.x < -400 || this.gumbo.x > 400) {
            this.gumbo.state = new GumboOffState();
        }
    }
}


function checkCollision(object1, object2) {
    return Math.abs(object1.x - object2.x) < 20 && Math.abs(object1.y - object2.y) < 20;
}

function checkCollisionBigX(object1, object2) {
    return Math.abs(object1.x - object2.x) < 40;
}