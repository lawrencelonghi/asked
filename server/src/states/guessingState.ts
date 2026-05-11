import type { RoundState } from "./roundStateInterface.js"
import { Round } from "../models/round.js"
import { Server } from 'socket.io'
import { ResultState } from "./resultState.js"

// src/states/GuessingState.ts
export class GuessingState implements RoundState {
  readonly name = "guessing"

  onGuess(round: Round, guess: number, io: Server, roomId: string) {
    const isWinner = round.isMainPlayerWinner(guess)

    io.to(roomId).emit("start_game_result", true)
    io.to(roomId).emit("isMainPlayer_winner", isWinner)

    round.setState(new ResultState())
  }

  onVote()         {}
  onScoreChoosed() {}
  onQuestion()     {}
  onAnswer()       {}
}