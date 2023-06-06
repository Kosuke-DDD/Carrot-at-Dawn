"use strict";

// import from Main.js as arguments
let parameters;
let globalLinks;

export default class Carrot {
    constructor(_parameters, _globalLinks) {
        parameters = _parameters;
        globalLinks = _globalLinks;

        this.x = 0;
        this.y = 0;
        this.hp = parameters.carrotHp;
        this.state = NaN;
        this.isRightward = true;
        this.keyMap = [];
        this.beams = [];
        for (let i = 0; i < 10; i++) {
            this.beams.push(new Beam());
        }

        this.isOnGround = true;
        this.isReloaded = true;

        const animationImages3leaves = [document.getElementById("carrotFront1"), document.getElementById("carrotFront2")];
        const animationImages2Leaves = [document.getElementById("carrot2LeavesFront1"), document.getElementById("carrot2LeavesFront2")];
        const animationImages1Leaves = [document.getElementById("carrot1LeavesFront1"), document.getElementById("carrot1LeavesFront2")];
        const animationImages0Leaves = [document.getElementById("carrot0LeavesFront1"), document.getElementById("carrot0LeavesFront2")];
        this.animationImages = [animationImages0Leaves, animationImages1Leaves, animationImages2Leaves, animationImages3leaves];
        this.animationId = 0;
        this.animationIdLeaves = 3;
        this.animationCount = 0;

        const surprisedImage3Leaves = document.getElementById("carrotSurprise");
        const surprisedImage2Leaves = document.getElementById("carrot2LeavesSurprise");
        const surprisedImage1Leaves = document.getElementById("carrot1LeavesSurprise");
        const surprisedImage0Leaves = document.getElementById("carrot0LeavesSurprise");
        this.surprisedImages = [surprisedImage0Leaves, surprisedImage1Leaves, surprisedImage2Leaves, surprisedImage3Leaves];
    }
    initialize() {
        this.state = new CarrotActiveState(this); 
    }
    reset() {
        this.x = 0;
        this.y = 0;
        this.hp = parameters.carrotHp;
        this.animationIdLeaves = 3;
        this.isOnGround = true;
        this.isReloaded = true;
        this.state = new CarrotActiveState(this);        
    }
    getAttacked(gumbo) {
        if (this.state instanceof CarrotActiveState) {
            let isGameOver = false;

            if (this.hp > 0) {
                this.hp -= gumbo.power;
                if (this.hp <= 0) {
                    this.hp = 0;
                }                            
            } else {    // GAME OVER
                isGameOver = true;
            }
            this.beams.forEach(b => b.dissaper());
            this.state = new CarrotSurprisedState(this, gumbo, isGameOver);
        }
    }
    checkIfActive() {
        if (this.state instanceof CarrotActiveState) {
            return true;
        }
        return false;
    }
    update() {
        return this.state.update();
    }
    draw() {
        if (this.animationCount++ > 10) {
            this.animationId = (this.animationId + 1) % this.animationImages[this.animationIdLeaves].length;
            this.animationCount = 0;
        }

        if (!this.isOnGround) {
            this.animationCount += 5;
        }
        globalLinks.renderController.drawCharacter(this.animationImages[this.animationIdLeaves][this.animationId], this.x, this.y);
    }
    drawSurprisedImage() {
        this.animationCount++;
        if (this.animationCount % 3 != 0) {
            globalLinks.renderController.drawCharacter(this.surprisedImages[this.animationIdLeaves], this.x, this.y);
        }
    }
    carrotkeydown(e) {
        this.keyMap[e.code] = true;
    }
    carrotkeyup(e) {
        this.keyMap[e.code] = false;
        if (e.code == "Enter") {
            this.isReloaded = true; 
        }                  
    }
}

class Beam {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.power = 1;
        this.isWorking = false;
        this.images = [document.getElementById("carrotItemRight"), 
                       document.getElementById("carrotItemLeft")];
        this.imageIndex = 0;
    }
    initialize(x, y, isRightward) {
        this.x = x;
        this.y = y;
        this.speed = isRightward ? 10 : -10;
        this.imageIndex = isRightward ? 0 : 1;
        this.isWorking = true;
    }
    update() {
        if (!this.isWorking || this.x > 180 || this.x < -180) {
            this.isWorking = false;
            return;
        }
        this.x += this.speed;

        if (checkCollisionBigX(this, globalLinks.gumboController.gumboBig)) {
            this.attack(globalLinks.gumboController.gumboBig);
        }

        globalLinks.gumboController.gumbos.forEach((g) => {
            if (checkCollision(g, this)) {
                this.attack(g);
            }
        });

        this.draw();
    }
    draw() {
        globalLinks.renderController.drawCharacter(this.images[this.imageIndex], this.x, this.y);
    }
    attack(gumbo) {
        if (gumbo.getAttacked(this)) {
            this.dissaper();
        }
    }
    dissaper() {
        this.isWorking = false;
    }
}

class CarrotState {
    constructor(carrot) {
        this.carrot = carrot;
    }
    update() {

    }
}

class CarrotActiveState extends CarrotState {
    update() {
        // Update beams
        this.carrot.beams.forEach(b => b.update());

        // Handling Input and Update the Carrot
        if (this.carrot.keyMap["ArrowLeft"]) {
            this.carrot.x -= parameters.carrotSpeedX; // Left
            this.carrot.isRightward = false;
        }
        if (this.carrot.keyMap["ArrowRight"]) {
            this.carrot.x += parameters.carrotSpeedX; // Right
            this.carrot.isRightward = true;
        }
        if (this.carrot.keyMap["Enter"]) {   // Enter key "FIRE!!"
            if (this.carrot.isReloaded) {
                let index = this.carrot.beams.findIndex(b => !b.isWorking);
                if (index != -1) {
                    this.carrot.beams[index].initialize(this.carrot.x, this.carrot.y, this.carrot.isRightward);
                }
                this.carrot.isReloaded = false;
            } 
        }                    
        if (this.carrot.isOnGround) {
            if (this.carrot.keyMap["Space"]) {   //Space key
                this.carrot.isOnGround = false;
                this.carrot.jumpSpeed = parameters.carrotJumpSpeedY;
            }
        } else {
            this.carrot.y += this.carrot.jumpSpeed;
            if (this.carrot.y <= 0) {
                this.carrot.y = 0;
                this.carrot.isOnGround = true;
            }
            this.carrot.jumpSpeed -= parameters.carrotGravity;
        }

        this.carrot.draw();
    }
}

class CarrotSurprisedState extends CarrotState {
    constructor(carrot, gumbo, isGameOver) {
        super(carrot);
        this.isGameOver = isGameOver ? true : false;
        this.count = 0;
        this.speedX = carrot.x > gumbo.x ? parameters.carrotSurprisedSpeedX : -parameters.carrotSurprisedSpeedX;
        this.speedY = parameters.carrotSurprisedSpeedY;
    }
    update() {
        this.carrot.x += this.speedX;
        this.carrot.y += this.speedY;

        if (this.carrot.y <= 0) {
            this.carrot.y = 0;
            this.speedX = 0;
            this.speedY = 0;
        } else {
            this.speedY -= parameters.carrotSurprisedGravity;
        }

        this.carrot.drawSurprisedImage();

        if (this.count++ > parameters.carrotSurprisedFrames) {
            if (this.isGameOver) {
                if (globalLinks.notificationCentre.getIsDawned()) {
                    const newState = new CarrotGameClearState(this.carrot);
                    this.carrot.state = newState;
                    return;
                }
                this.carrot.state = new CarrotGameOverState(this.carrot);
                return;
            }

            this.carrot.state = new CarrotActiveState(this.carrot);
            if (this.carrot.hp == 0) {
                this.carrot.animationIdLeaves = 0;                            
            } else {
                // change leaves depending on HP
                const oneThirdHp = Math.floor(parameters.carrotHp / 3);
                if (this.carrot.hp <= oneThirdHp) {
                    this.carrot.animationIdLeaves = 1;                                 
                } else if (this.carrot.hp <= 2 * oneThirdHp) {
                    this.carrot.animationIdLeaves = 2; 
                } else {
                    this.carrot.animationIdLeaves = 3;
                }
            } 
        }
    }
}

class CarrotGameOverState extends CarrotState {
    constructor(carrot) {
        super(carrot);
        this.animationLR = true;
        this.ctx = globalLinks.ctx;
    }
    update() {
        if (this.carrot.y > -60) {
            globalLinks.renderController.drawCharacter(this.carrot.surprisedImages[0], this.carrot.x + (this.animationLR * 3), this.carrot.y);
            // re-draw the ground
            this.ctx.fillStyle = "#331122";
            this.ctx.fillRect(0, 215, 300, 85);
            this.animationLR = !this.animationLR;
            this.carrot.y -= 1;
        } else {
            this.carrot.state = new CarrotOffState();
            globalLinks.notificationCentre.setIsGameOver(true);
        }
    }
}

class CarrotGameClearState extends CarrotState {
    constructor(carrot) {
        super(carrot);
        this.phase = 1;
        this.counter = 0;
    }
    update() {
        switch (this.phase) {
            case 1:
                // surprised image with no leaves
                globalLinks.renderController.drawCharacter(this.carrot.surprisedImages[0], this.carrot.x, this.carrot.y);
                if (this.counter++ > 100) {
                    this.conter = 0;
                    this.phase = 2;
                    this.carrot.isOnGround = false;
                    this.carrot.animationIdLeaves = 3;
                }
                break;
            case 2:
                if (this.carrot.y < 300) {
                    // Strong attacks while ascending
                    if (this.carrot.y < 170 && checkCollisionBigX(this.carrot, globalLinks.gumboController.gumboBig)) {
                        this.attack(globalLinks.gumboController.gumboBig);
                    }
                    globalLinks.gumboController.gumbos.forEach((g) => {
                        if (checkCollision(g, this.carrot)) {
                            this.attack(g);
                        }
                    });
                    this.carrot.y += 2;
                    this.carrot.draw();
                } else {
                    this.carrot.state = new CarrotOffState();
                    globalLinks.notificationCentre.setIsGameOver(true);
                }
                break;
        }
    }
    attack(_gumbo) {
        _gumbo.getAstonished();
    }
}

class CarrotOffState extends CarrotState {
    constructor() {
        super(NaN);
    }
    update() {
        return;
    }
}

function checkCollision(object1, object2) {
    return Math.abs(object1.x - object2.x) < 20 && Math.abs(object1.y - object2.y) < 20;
}

function checkCollisionBigX(object1, object2) {
    return Math.abs(object1.x - object2.x) < 40;
}