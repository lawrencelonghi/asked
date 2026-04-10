import type Message from "../models/message.js"
import type { Player } from "./player.js";
import type { Vote } from "./vote.js";

class Room {
    private id: string;
    private players: string[];
    private messageHistory: Message[];
    private votes: Vote[]

    constructor(private socketId: string) {
        this.id = this._generateId();
        this.players = [socketId];
        this.messageHistory = [];
        this.votes = []
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

    getVotes() {
        return this.votes
    }

    addVote(vote: Vote): boolean {
        const alreadyVoted = this.votes.some(v => v.whoVoted.socketId === vote.whoVoted.socketId)
        if(alreadyVoted) return false

        this.votes.push(vote)
        return true
    }

    allPlayersVoted(): boolean {
        
        return this.players.every(socketId => this.votes.some(v => v.whoVoted.socketId === socketId))
    }

    calculateMainPlayer(): Player | null {
        const voteCount = new Map<string, { player: Player; count: number }>()

        for(const vote of this.votes) {
            const playerThatWasVotedSocketId = vote.votedFor.socketId
            const currentVotes = voteCount.get(playerThatWasVotedSocketId)

            if(currentVotes) {
                currentVotes.count++
            } else {
                voteCount.set(playerThatWasVotedSocketId, {player: vote.votedFor, count: 1})
            }
        }

        let mainPlayer: Player | null = null
        let maxVotes = 0

        for (const { player, count } of voteCount.values()) {
            if(count > maxVotes) {
                maxVotes = count
                mainPlayer = player
            }
        }

        return mainPlayer
    }

    clearVotes() {
        this.votes = []
    }

}

export default Room;