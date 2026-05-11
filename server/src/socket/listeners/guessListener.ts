// src/socket/listeners/guessListener.ts
import { ConnectionListener } from "./connectionListener.js";
import { type Server, type Socket } from 'socket.io'
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";

export class GuessConnectionListener extends ConnectionListener {
  private roomRepository: RoomRepository
  private roundRepository: RoundRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.roundRepository = new RoundRepository()
  }

  listen(): void {
    this.handleGuess()
  }

  private handleGuess() {
    this.socket.on('mainPlayer_guess', (guess: number) => {
      const room  = this.roomRepository.findBySocketId(this.socket.id)
      const round = room && this.roundRepository.findActiveByRoom(room)
      if (!room || !round) return

      round.handleGuess(guess, this.io, room.getId())
      this.roundRepository.save(round)
    })
  }
}