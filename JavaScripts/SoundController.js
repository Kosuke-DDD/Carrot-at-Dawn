"use strict";

export default class SoundController {
    constructor () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        const promise = fetch("Sounds/CarrotAtDawn.mp3");
        promise
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.bgmAudioBuffer = audioBuffer;                      
            });

        this.audioContext = audioContext;
        this.bgmSource = NaN;
        this.isPlayingBGM = false;
    }
    playBGM() {
        if (this.isPlayingBGM) { return; }
        this.bgmSource = this.audioContext.createBufferSource();
        this.bgmSource.buffer = this.bgmAudioBuffer;
        this.bgmSource.connect(this.audioContext.destination);
        this.bgmSource.loop = true;
        this.bgmSource.start();
        this.isPlayingBGM = true;
    }
    stopBGM() {
        this.bgmSource.stop();
        this.isPlayingBGM = false;
    }
}