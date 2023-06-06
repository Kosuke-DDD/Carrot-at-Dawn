export default class NotificationCentre {
    constructor() {
        this.isGameOver = false;
        this.isDawned = false;
        this.isMaxScore = false;
        this.lastMessage = "Game Over...";
    }
    reset() {
        this.isGameOver = false;
        this.isDawned = false;
        this.isMaxScore = false;
        this.lastMessage = "Game Over...";
    }
    getLastMessage() {
        return this.lastMessage;
    }
    setLastMessage(_lastMessage) {
        this.lastMessage = _lastMessage;
    }
    getIsGameOver() {
        return this.isGameOver;
    }
    setIsGameOver(_isGameOver) {
        this.isGameOver = _isGameOver;
    }
    getIsDawned() {
        return this.isDawned;
    }
    setIsDawned(_isDawned) {
        this.isDawned = _isDawned;
        if (this.isDawned) {
            this.lastMessage = "Congratulations!!"
        }
    }
    getIsMaxScore() {
        return this.isMaxScore;
    }
    setIsMaxScore(_isMaxScore) {
        this.isMaxScore = _isMaxScore;
    }
}