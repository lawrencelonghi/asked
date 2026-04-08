import type Message from "../models/message.js"

class Room {
    private id: string;
    private players: string[];
    private messageHistory: Message[];

    constructor(private socketId: string) {
        this.id = this._generateId();
        this.players = [socketId];
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

    addPlayer(socketId: string) {
        if (!this.players.includes(socketId)) {
        this.players.push(socketId);
        }
    }

    removePlayer(socketId: string) {
        this.players = this.players.filter(id => id !== socketId);
    }


    getPlayers() {
        return this.players;
    }

    hasPlayer(socketId: string) {
        return this.players.includes(socketId);
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