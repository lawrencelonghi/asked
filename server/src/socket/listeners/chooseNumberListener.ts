import { ConnectionListener } from "./connectionListener.js";
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { type Server, type Socket } from 'socket.io'
import { Score } from "../../models/score.js";
import { MessageRepository } from "../../repositories/messageRepository.js";


export class chooseNumberConnectionListener extends ConnectionListener {
  private roomRepository: RoomRepository
  private roundRepository: RoundRepository
  private messageRepository: MessageRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.roundRepository = new RoundRepository()
    this.messageRepository = new MessageRepository()
  }

  listen() {
    this.scoreHandler()
  }

  private scoreHandler() {
    this.socket.on("score_choosed", (score: number) => {
      const room   = this.roomRepository.findBySocketId(this.socket.id)
      const round  = room && this.roundRepository.findActiveByRoom(room)
      const player = room?.getPlayerBySocketId(this.socket.id)
      if (!room || !round || !player) return

      round.handleScore(score, player, this.io, room.getId())
      this.roundRepository.save(round)
    })
  }
}