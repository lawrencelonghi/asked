import type Message from "../models/message.js"
import type { Player } from "./player.js";
import type { Score } from "./score.js";
import type { Vote } from "./vote.js";
import type { Round } from "./round.js";
class Room {
    private id: string;
    private players: Player[];
    private messageHistory: Message[];
    private rounds: Round[]

    constructor(private socketId: string) {
        this.id = this.generateRoomId();
        this.players = []
        this.messageHistory = [];
        this.rounds = []
    }

    getId() {
        return this.id
    }


    getSocketId(): string {
        return this.socketId
    }

    private generateRoomId() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem caracteres confusos
        const length = 12
        let id = '';

        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    }

    addPlayer(player: Player) {
        if (!this.players.some(p => p.socketId === player.socketId)) {
        this.players.push(player);
        }
    }

    removePlayer(player: Player) {
        this.players = this.players.filter(p => p.socketId !== player.socketId);
    }


    getPlayers() {
        return this.players;
    }

    hasPlayer(socketId: string) {
        return this.players.some(p => p.socketId === socketId);
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
    
    getRounds() {
        return this.rounds
    }

}

export default Room;