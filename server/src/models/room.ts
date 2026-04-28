import type Message from "../models/message.js"
import type { Player } from "./player.js";
import type { Round } from "./round.js";
class Room {
    private id: string;
    private players: Player[];
    private messageHistory: Message[];
    private rounds: Round[]
    private roomCreatorSocketId: string;

    constructor(private socketId: string) {
        this.id = this.generateRoomId();
        this.players = []
        this.messageHistory = [];
        this.rounds = []
        this.roomCreatorSocketId = socketId
    }

    getId() {
        return this.id
    }

    // retorna a 
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

    getRoomCreatorSocketId(): string {
        return this.roomCreatorSocketId;
    }

    getRoomCreatorPlayer(): Player | undefined {
        return this.players.find(p => p.socketId === this.roomCreatorSocketId)
    }

    isRoomCreator(socketId: string): boolean {
        return this.roomCreatorSocketId === socketId;
    }

    addPlayer(player: Player) {
        if (!this.players.some(p => p.socketId === player.socketId)) {
        this.players.push(player);
        }
    }

    setPlayerAsRoomCreator(): boolean {
        return true
    }

    removePlayer(playerSockeId: string) {
        this.players = this.players.filter(p => p.socketId !== playerSockeId);
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

    startRound(round: Round) {
        return this.rounds.push(round)
    }
    
    getRounds() {
        return this.rounds
    }

}

export default Room;