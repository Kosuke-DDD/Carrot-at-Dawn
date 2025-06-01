"use strict";

export default class SoundController {
    constructor () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const bgmSource = audioContext.createBufferSource();
        
        const promise = fetch("Sounds/CarrotAtDawn.mp3");
        promise
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                bgmSource.buffer = audioBuffer;
                bgmSource.connect(audioContext.destination);
                bgmSource.loop = true;
                this.bgmAudioBuffer = audioBuffer;                      
            });

        this.audioContext = audioContext;
        this.bgmSource = bgmSource;
        this.isPlayingBGM = false;
        this.isMute = true;
    }
    playBGM() {
        if (this.isPlayingBGM) { return; }
        if (this.isMute) { return; }
        if (this.audioContext.state === "suspended") { return; }
        this.bgmSource.start();
        this.isPlayingBGM = true;
    }
    stopBGM() {
        if (!this.isPlayingBGM) { return; }
        this.bgmSource.stop();
        this.bgmSource = this.audioContext.createBufferSource();
        this.bgmSource.buffer = this.bgmAudioBuffer;
        this.bgmSource.connect(this.audioContext.destination);
        this.bgmSource.loop = true;
        this.isPlayingBGM = false;
    }
    prepareSilenceForIPhone() {
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
        }
        if (!this.isPlayingBGM) {
            const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0);
        }
    }
    checkIsPlayingBGM() {
        return this.isPlayingBGM;
    }
    checkIsMute() {
        return this.isMute;
    }
    muteOn() {
        this.isMute = true;
    }
    muteOff() {
        this.isMute = false;
    }
}