import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { PlayerRepository } from "../../repositories/playerRepository.js"
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'
import { QuestionRepository } from "../../repositories/questionRepository.js";
import { Question } from "../../models/question.js";

export class QuestionConnectionListener extends ConnectionListener {
  private roundRepository: RoundRepository
  private roomRepository: RoomRepository
  private playerRepository: PlayerRepository
  private questionRepository: QuestionRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roundRepository = new RoundRepository()
    this.roomRepository =  new RoomRepository()
    this.playerRepository = new PlayerRepository()
    this.questionRepository = new QuestionRepository()
  }

  listen() {
    this.handleQuestion()
  }

  private handleQuestion() {
    this.socket.on("mainPlayer_question", (content: string) => {
      const room  = this.roomRepository.findBySocketId(this.socket.id)
      const round = room && this.roundRepository.findActiveByRoom(room)
      if (!room || !round) return

      round.handleQuestion(content, this.io, room.getId())
      this.roundRepository.save(round)
    })
  }
}