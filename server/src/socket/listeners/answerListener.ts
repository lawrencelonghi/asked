// src/socket/listeners/answerListener.ts
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'

export class AnswerConnectionListener extends ConnectionListener {
  private roundRepository: RoundRepository
  private roomRepository: RoomRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roundRepository = new RoundRepository()
    this.roomRepository = new RoomRepository()
  }

  listen() {
    this.handleAnswer()
  }

  private handleAnswer() {
    this.socket.on('player_answer', (content: string) => {
      const room   = this.roomRepository.findBySocketId(this.socket.id)
      const round  = room && this.roundRepository.findActiveByRoom(room)
      const player = room?.getPlayerBySocketId(this.socket.id)
      if (!room || !round || !player) return

      round.handleAnswer(content, player, this.io, room.getId())
      this.roundRepository.save(round)
    })
  }
}