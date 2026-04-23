import type { Player } from "./player.js";
import type { Score } from "./score.js";
import type { Vote } from "./vote.js";
import Room from "./room.js";

export class Round {
  private id: string
  private room: Room 
  private roundRoomId: string
  private votes: Vote[]
  private playersReadyToPlay: Player[]
  private mainPlayer: Player | null
  private scores: Score[]


  constructor(room: Room ) {
    this.id = this.generateRoundId()
    this.room = room
    this.roundRoomId = room.getId()
    this.votes = []
    this.playersReadyToPlay = []
    this.mainPlayer = this.getMainPlayer()
    this.scores = []
  }

    private generateRoundId() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem caracteres confusos
      const length = 12
      let id = '';

      for (let i = 0; i < length; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return id;
    }

   getId() {
    return this.id
   }

   getRoom() {
    return this.room
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
      return this.room.getPlayers().every(p => this.votes.some(v => v.whoVoted.socketId === p.socketId));
  }
    getMainPlayer(): Player | null {
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

    addPlayerReadyToPlay(player: Player) {
        this.playersReadyToPlay.push(player)
    }

  allPlayersReadyToPlay(): boolean {
      return this.room.getPlayers().every(p => 
          this.playersReadyToPlay.some(ready => ready.socketId === p.socketId))
    }

    gameStarted(): boolean {
        return this.allPlayersReadyToPlay()

    }

    addScore(score: Score) {
        this.scores.push(score)
    }


    getScore(): number {
        const numberCount = new Map<number, number>() 

        for (const score of this.scores) {
            const current = numberCount.get(score.number) ?? 0
            numberCount.set(score.number, current + 1)
        }

        let roundScore: number = 0
        let maxVotes = 0

        for (const [number, votes] of numberCount.entries()) {
            if (votes > maxVotes) {
                maxVotes = votes
                roundScore = number 
            }
        }

        return roundScore
    }
}