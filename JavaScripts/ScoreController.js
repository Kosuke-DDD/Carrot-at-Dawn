"use strict";

// import from Main.js as arguments
let ctx;
let globalLinks;

export default class ScoreController {
    constructor(_globalLinks) {
        ctx = _globalLinks.ctx;
        globalLinks = _globalLinks;
        this.totalScore = 0;
        this.pointSprites = [new PointSprite(), new PointSprite(), new PointSprite(), new PointSprite(), new PointSprite()];
        this.spriteIndex = 0;
    }
    update() {
        this.pointSprites.forEach(p => p.update());
        this.drawTotalScore();
    }
    getScore(x, y, point, color) {
        this.pointSprites[this.spriteIndex].initialize(x, y, point, color);
        this.spriteIndex = (this.spriteIndex + 1) % this.pointSprites.length;
        this.totalScore += point;
        if (this.totalScore >= 9999999) {
            this.totalScore = 9999999;
            globalLinks.notificationCentre.setIsMaxScore(true);
        }       
    }
    drawTotalScore() {
        ctx.font = "18px 'Times New Roman'";
        ctx.fillStyle = "#331122";
        ctx.fillText(("0000000" + this.totalScore).slice(-7), 220, 30);
    }
    reset() {
        this.totalScore = 0;
        this.spriteIndex = 0;
    }
}

class PointSprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speedY = 1;
        this.point = 0;
        this.color = "white";
        this.isWorking = false;
    }
    initialize(x, y, point, color) {
        this.x = x;
        this.y = y;
        this.point = point;
        this.color = color || "white";
        this.isWorking = true;
    }
    update() {
        if (!this.isWorking || this.y > 20) {
            this.isWorking = false;
            return;
        }
        this.y += this.speedY;
        this.draw();
    }
    draw() {
        ctx.font = "14px 'Times New Roman'";
        ctx.fillStyle = this.color;
        const textWidth = ctx.measureText(this.point).width
        ctx.fillText(this.point, this.x + 150 - ( textWidth / 2 ), 160 - this.y);
    }
}
