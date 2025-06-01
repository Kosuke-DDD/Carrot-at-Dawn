"use strict";

// import from Main.js as arguments
let ctx;
let globalLinks;

export default class RenderController {
    constructor(_globalLinks) {
        ctx = _globalLinks.ctx;
        globalLinks = _globalLinks;
        // the skyColor starts at "#00338A" and ends at "#EE3300" (R239, G52, B0)
        this.skyR = 0;   // 00
        this.skyG = 52;  // 33
        this.skyB = 139; // 8A
        this.sunPositionY = 250;    // downwards is positive
        this.timeCounter = 0;
        this.isDawning = false;
        this.isCounting = false;

        // Buttons
        const leftImage = document.getElementById("button_left_png");
        const rightImage = document.getElementById("button_right_png");
        const enterImage = document.getElementById("button_enter_png");
        const spaceImage = document.getElementById("button_space_png");
        const ctxL = document.getElementById("button_left").getContext("2d");
        const ctxR = document.getElementById("button_right").getContext("2d");
        const ctxEnter = document.getElementById("button_enter").getContext("2d");
        const ctxSpace = document.getElementById("button_space").getContext("2d");
        ctxL.drawImage(leftImage, 0, 0);
        ctxR.drawImage(rightImage, 0, 0);
        ctxEnter.drawImage(enterImage, 0, 0);
        ctxSpace.drawImage(spaceImage, 0, 0);
        this.leftImage = leftImage;
        this.rightImage = rightImage;
        this.enterImage = enterImage;
        this.spaceImage = spaceImage;
        this.ctxL = ctxL;
        this.ctxR = ctxR;
        this.ctxEnter = ctxEnter;
        this.ctxSpace = ctxSpace;

        // Sound Indicator
        this.noteImage = document.getElementById("note_png");
        this.mutedNoteImage = document.getElementById("muted_note_png");
    }
    drawCharacter(image, x, y) {
        ctx.drawImage(image, x + 125, 165 - y)  // character size: 50x50, canvas size: 300x300
    }
    drawBigCharacter(image, x, y) {
        ctx.drawImage(image, x + 75, 65 - y)  // bigCharacter size: 150x150, canvas size: 300x300
    }
    drawBackground() {
        if (this.isDawning) {   // the sky is dawning
            // increment counter (if isDawning is true)
            if (this.isCounting && this.timeCounter++ > 20) {
                this.skyR += 2;
                this.skyB -= 1;
    
                this.skyR = Math.min(this.skyR, 239);
                this.skyB = Math.max(this.skyB, 0);

                if (this.skyR > 160) {
                    this.sunPositionY--;
                    if (this.sunPositionY <= 190) {
                        this.sunPositionY = 190;
                        globalLinks.notificationCentre.setIsDawned(true);
                    }
                }
    
                this.timeCounter = 0;
            }
            // the sky
            const r = this.skyR < 16 ? "0" + this.skyR.toString(16) : this.skyR.toString(16);
            const b = this.skyB < 16 ? "0" + this.skyB.toString(16) : this.skyB.toString(16);          
            const skyColor = "#" + r + this.skyG.toString(16) + b;
            ctx.fillStyle = skyColor;
            ctx.fillRect(0, 0, 300, 300);

            // the sun
            ctx.globalAlpha = 0.02;
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(150, this.sunPositionY, 60, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(150, this.sunPositionY, 50, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(150, this.sunPositionY, 40, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.beginPath();
            ctx.arc(150, this.sunPositionY, 30, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        } else {    // the sky is dark blue unless the sly is dawning
            ctx.fillStyle = "#00338A";
            ctx.fillRect(0, 0, 300, 300);
        }

        // the earth
        ctx.fillStyle = "#331122";
        ctx.fillRect(0, 200, 300, 100);

        // Sound On / Off Indicator
        if (globalLinks.soundController.checkIsMute()) {
            ctx.drawImage(this.mutedNoteImage, 5, 5);
        } else {
            ctx.drawImage(this.noteImage, 5, 5);
        }

        // increment counter (if isDawning is false)
        if (this.isCounting && !this.isDawning && this.timeCounter++ > 200) {
            this.isDawning = true;

            this.timeCounter = 0;
        }
    }
    reset() {
        this.isDawning = false;
        this.isCounting = false;
        this.timeCounter = 0;
        this.skyR = 0; // 00
        this.skyG = 52; // 33
        this.skyB = 139; // 8A
        this.sunPositionY = 250;
    }
    startCounter() {
        this.isCounting = true;
    }
    stopCounter() {
        this.isCounting = false;
    }
    drawLeftButton(isOpaque) {
        this.ctxL.fillStyle = "#ffffff";
        this.ctxL.fillRect(0, 0, 100, 100);
        if (isOpaque) {
            this.ctxL.globalAlpha = 0.75;
        }
        this.ctxL.drawImage(this.leftImage, 0, 0);
        this.ctxL.globalAlpha = 1.0;
    }
    drawRightButton(isOpaque) {
        this.ctxR.fillStyle = "#ffffff";
        this.ctxR.fillRect(0, 0, 100, 100);
        if (isOpaque) {
            this.ctxR.globalAlpha = 0.75;
        }
        this.ctxR.drawImage(this.rightImage, 0, 0);
        this.ctxR.globalAlpha = 1.0;
    }
    drawEnterButton(isOpaque) {
        this.ctxEnter.fillStyle = "#ffffff";
        this.ctxEnter.fillRect(0, 0, 100, 100);
        if (isOpaque) {
            this.ctxEnter.globalAlpha = 0.75;
        }
        this.ctxEnter.drawImage(this.enterImage, 0, 0);
        this.ctxEnter.globalAlpha = 1.0;
    }
    drawSpaceButton(isOpaque) {
        this.ctxSpace.fillStyle = "#ffffff";
        this.ctxSpace.fillRect(0, 0, 300, 100);
        if (isOpaque) {
            this.ctxSpace.globalAlpha = 0.75;
        }
        this.ctxSpace.drawImage(this.spaceImage, 0, 0);
        this.ctxSpace.globalAlpha = 1.0;
    }
}