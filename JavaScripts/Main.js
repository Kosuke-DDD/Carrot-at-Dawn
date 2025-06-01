"use strict";
import Carrot from "./Carrot.js";
import GumboController from "./GumboController.js";
import ScoreController from "./ScoreController.js";
import SoundController from "./SoundController.js";
import RenderController from "./RenderController.js";
import NotificationCentre from "./NotificationCentre.js";

// managed by json
let parameters; 

// Local (only for Main.js)
let timerId = NaN;
let startTime = NaN;
let gameState;
let musicPlayFunction;
let musicStopFunction;

// Global (used by other script files with globalLinks pattern)
let ctx;
let carrot;
let gumboController;
let soundController;
let scoreController;
let renderController;
let notificationCentre;

onload = function () {
    ctx = document.getElementById("field").getContext("2d");

    soundController = new SoundController();

    fetch('JSON/Parameters.json')
        .then(response => response.json())
        .then((json) => {
            const globalLinks = {
                ctx: ctx,
                carrot: NaN,
                gumboController: NaN,
                soundController: NaN,
                scoreController: NaN,
                renderController: NaN,
                notificationCentre: NaN
            }

            parameters = json;
            carrot = new Carrot(parameters, globalLinks);
            gumboController = new GumboController(parameters, globalLinks);
            scoreController = new ScoreController(globalLinks);
            renderController = new RenderController(globalLinks);
            notificationCentre = new NotificationCentre();

            globalLinks.carrot = carrot;
            globalLinks.gumboController = gumboController;
            globalLinks.soundController = soundController;
            globalLinks.scoreController = scoreController;
            globalLinks.renderController = renderController;
            globalLinks.notificationCentre = notificationCentre;

            carrot.initialize();

            gameState = new TitleGameState();
            timerId = setInterval(update, 50);
        });
    
    onkeyup = () => {};

    onkeydown = () => {
        soundController.prepareSilenceForIPhone();
        start();
    }

    musicPlayFunction = () => {};
    musicStopFunction = () => {};

    this.document.getElementById("field").onmousedown = function (e) {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX;
        const clickY = e.clientY;
        if (clickX > rect.left + 50 || clickY > rect.top + 50) { return; }

        soundController.prepareSilenceForIPhone();
        if (soundController.checkIsMute()) {
            soundController.muteOff();
            musicPlayFunction();
        } else {
            soundController.muteOn();
            musicStopFunction();
        }
    }
    this.document.getElementById("field").addEventListener('touchstart', (e) => {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.touches[0].clientX;
        const clickY = e.touches[0].clientY;
        if (clickX > rect.left + 50 || clickY > rect.top + 50) { return; }

        soundController.prepareSilenceForIPhone();
        if (soundController.checkIsMute()) {
            soundController.muteOff();
            musicPlayFunction();
        } else {
            soundController.muteOn();
            musicStopFunction();
        }
    })
    this.document.addEventListener('touchend', (e) => {
        e.preventDefault();
        soundController.prepareSilenceForIPhone();
    }, { once: true })

    this.document.getElementById("button_left").onmousedown = function (e) {
        e.preventDefault();
        window.onkeydown({ code: "ArrowLeft" });
    }
    this.document.getElementById("button_left").addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.onkeydown({ code: "ArrowLeft" })
    })
    this.document.getElementById("button_left").onmouseup = function (e) {
        e.preventDefault();
        window.onkeyup({ code: "ArrowLeft" });
    }
    this.document.getElementById("button_left").addEventListener('touchend', (e) => {
        e.preventDefault();
        window.onkeyup({ code: "ArrowLeft" })
    })

    this.document.getElementById("button_right").onmousedown = function (e) {
        e.preventDefault();
        window.onkeydown({ code: "ArrowRight" });
    }
    this.document.getElementById("button_right").addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.onkeydown({ code: "ArrowRight" })
    })
    this.document.getElementById("button_right").onmouseup = function (e) {
        e.preventDefault();
        window.onkeyup({ code: "ArrowRight" });
    }
    this.document.getElementById("button_right").addEventListener('touchend', (e) => {
        e.preventDefault();
        window.onkeyup({ code: "ArrowRight" })
    })

    this.document.getElementById("button_enter").onmousedown = function (e) {
        e.preventDefault();
        window.onkeydown({ code: "Enter" });
    }
    this.document.getElementById("button_enter").addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.onkeydown({ code: "Enter" })
    })
    this.document.getElementById("button_enter").onmouseup = function (e) {
        e.preventDefault();
        window.onkeyup({ code: "Enter" });
    }
    this.document.getElementById("button_enter").addEventListener('touchend', (e) => {
        e.preventDefault();
        window.onkeyup({ code: "Enter" })
    })

    this.document.getElementById("button_space").onmousedown = function (e) {
        e.preventDefault();
        window.onkeydown({ code: "Space" });
    }
    this.document.getElementById("button_space").addEventListener('touchstart', (e) => {
        e.preventDefault();
        window.onkeydown({ code: "Space" })
    })
    this.document.getElementById("button_space").onmouseup = function (e) {
        e.preventDefault();
        window.onkeyup({ code: "Space" });
    }
    this.document.getElementById("button_space").addEventListener('touchend', (e) => {
        e.preventDefault();
        window.onkeyup({ code: "Space" })
    })
};

function start() {
    soundController.playBGM();
    renderController.startCounter();
    gameState = new GameGameState();
    startTime = new Date();
    musicPlayFunction = () => {soundController.playBGM();};
    musicStopFunction = () => {soundController.stopBGM();};

    onkeydown = (e) => {
        switch (e.code) {
            case "ArrowLeft":
                renderController.drawLeftButton(true);
                break;
            case "ArrowRight":
                renderController.drawRightButton(true);
                break;
            case "Enter":
                renderController.drawEnterButton(true);
                break;
            case "Space":
                renderController.drawSpaceButton(true);
                break;
        }
        carrot.carrotkeydown(e);
    }
    onkeyup = (e) => {
        switch (e.code) {
            case "ArrowLeft":
                renderController.drawLeftButton(false);
                break;
            case "ArrowRight":
                renderController.drawRightButton(false);
                break;
            case "Enter":
                renderController.drawEnterButton(false);
                break;
            case "Space":
                renderController.drawSpaceButton(false);
                break;
        }
        carrot.carrotkeyup(e);
    }
}

function update() {
    gameState.update();
}

class GameState {
    constructor() {}
    update() {}
}

class TitleGameState extends GameState {
    constructor() {
        super();
        this.animationCount = 0;
        this.animationSpeed = 10
        this.isTitled = false;
        musicPlayFunction = () => {};
        musicStopFunction = () => {};
    }
    update() {
        renderController.drawBackground();
        if (this.animationCount++ > this.animationSpeed) {
            this.isTitled = !this.isTitled;
            this.animationCount = 0;
        }
        if (this.isTitled) {
            ctx.font = "18px 'Times New Roman'";
            ctx.fillStyle = "#331122";
            ctx.fillText("PRESS ANY KEY TO START", 20, 100);
        }
    }
}

class GameGameState extends GameState {
    update() {
        renderController.drawBackground();
        carrot.update();
        gumboController.update();
        scoreController.update();
        if (notificationCentre.getIsGameOver()) {
            gameState = new GameOverState();
        }
    }
}

class GameOverState extends GameState {
    constructor() {
        super();
        renderController.stopCounter();
        this.lastMessage = notificationCentre.getLastMessage();
        this.lastMessage2 = "";
        this.clearTime = "";
        this.clearTimeText = "";

        // Game Clear
        if (notificationCentre.getIsDawned()) {
            const now = new Date();
            const elapsedMilliseconds = now.getTime() - startTime.getTime();
            let hour = Math.floor(elapsedMilliseconds / 1000 / 3600);
            let min = Math.floor(((elapsedMilliseconds / 1000) % 3600) / 60);
            let sec = Math.floor(((elapsedMilliseconds / 1000) % 60));
            let milli = Math.floor((elapsedMilliseconds / 10) % 100);
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            if (milli < 10) {
                milli = "0" + milli;
            }
            this.clearTime = hour + ":" + min + ":" + sec + "." + milli;
            if (notificationCentre.getIsMaxScore()) {
                setTimeout(() => {
                    this.lastMessage2 = "You are a crazy carrot!"
                    setTimeout(() => {
                        this.clearTimeText = this.clearTime;
                        onkeydown = () => {
                            ;
                        };
                        onkeyup = () => {
                            ;
                        };
                    }, 2000);
                }, 5000)
            } else {
                setTimeout(() => {
                    this.lastMessage2 = "So bright!!!"
                    setTimeout(() => {
                        this.clearTimeText = this.clearTime;
                        onkeydown = () => {
                            ;
                        };
                        onkeyup = () => {
                            ;
                        };
                    }, 2000);
                }, 2000)                
            }
            return;
        }
        
        setTimeout(() => {
            onkeydown = (e) => {
                carrot.reset();
                gumboController.reset();
                scoreController.reset();
                renderController.reset();
                notificationCentre.reset();
                soundController.stopBGM();
    
                gameState = new TitleGameState();
    
                setTimeout(() => {
                    onkeydown = (e) => {
                        start();
                    }
                }, 1000);
            }
        }, 3000);
    }
    update() {
        renderController.drawBackground();
        gumboController.update();
        scoreController.update();

        ctx.font = "36px 'Times New Roman'";
        ctx.fillStyle = "white";
        if (!notificationCentre.getIsDawned()) {
            const textWidth = ctx.measureText(this.lastMessage).width
            ctx.fillText(this.lastMessage,  30 + 150 - ( textWidth / 2 ), 90);    // Game Over...           
        } else {
            const textWidth = ctx.measureText(this.lastMessage).width
            ctx.fillText(this.lastMessage, 150 - ( textWidth / 2 ), 80);    // Congratulations!!
            ctx.font = "24px 'Times New Roman'";
            const textWidth2 = ctx.measureText(this.lastMessage2).width
            ctx.fillText(this.lastMessage2, 150 - ( textWidth2 / 2 ), 260);    // so bright OR crazy carrot
            ctx.font = "18px 'Times New Roman'";
            ctx.fillText(this.clearTimeText, 40, 30);
        }
    }
}