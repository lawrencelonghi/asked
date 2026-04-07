import type Message from "../models/message.js"

class Room {
    private id: string;
    private players: string[];
    private messageHistory: Message[];

    constructor(private socketId: string) {
        this.id = this._generateId();
        this.players = [];
        this.messageHistory = [];
    }

    getId() {
        return this.id
    }


    getSocketId(): string {
        return this.socketId
    }

    _generateId() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem caracteres confusos
        const length = 12
        let id = '';

        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    }

    addPlayer(playerId: string) {
        if (this.players.length < 6) {
            this.players.push(playerId);
            return true;
        }
        return false;
    }

    removePlayer(playerId: string) {
        this.players = this.players.filter(id => id !== playerId);
        return this;
    }

    getPlayers() {
        return this.players;
    }

    getPlayersAmount() {
        return this.players.length;
    }

    addMessage(message: Message) {
        this.messageHistory.push(message);
    }

    getMessageHistory() {
        return this.messageHistory;
    }


}

export default Room;