import { Round } from "../../models/round.js";
import { MessageRepository } from "../../repositories/messageRepository.js";
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { PlayerRepository } from "../../repositories/playerRepository.js"
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'
import Room from "../../models/room.js";

export class QuestionAnswerConnectionListener extends ConnectionListener {
  private roundRepository: RoundRepository
  private roomRepository: RoomRepository
  private playerRepository: PlayerRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roundRepository = new RoundRepository()
    this.roomRepository =  new RoomRepository()
    this.playerRepository = new PlayerRepository()
  }

  listen() {
    this.handleQuestion()
    this.handleAnswer()
  }

  handleQuestion() {
    this.socket.on('mainPlayer_question', (data) => {
      const mainPlayerQuestion = data
      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return

      const pĺayers = this.playerRepository.getPlayersByRoom(room)

      
    })
  }

  handleAnswer() {

  }
}