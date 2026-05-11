// src/states/RoundState.ts
import type { Round } from "../models/round.js"
import type { Player } from "../models/player.js"
import type { Vote } from "../models/vote.js"
import type { Server } from "socket.io"

export interface RoundState {
  readonly name: string
  onVote(round: Round, vote: Vote, io: Server, roomId: string): void
  onScoreChoosed(round: Round, score: number, player: Player, io: Server, roomId: string): void
  onQuestion(round: Round, content: string, io: Server, roomId: string): void
  onAnswer(round: Round, content: string, player: Player, io: Server, roomId: string): void
  onGuess(round: Round, guess: number, io: Server, roomId: string): void
}