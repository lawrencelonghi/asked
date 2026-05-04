import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { PlayerRepository } from "../../repositories/playerRepository.js"
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'
import { QuestionRepository } from "../../repositories/questionRepository.js";
import { AnswerRepository } from "../../repositories/answerRepository.js";
import { Answer } from "../../models/answer.js";

export class AnswerConnectionListener extends ConnectionListener {
  private roundRepository: RoundRepository
  private roomRepository: RoomRepository
  private playerRepository: PlayerRepository
  private questionRepository: QuestionRepository
  private answerRepository: AnswerRepository

    constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roundRepository = new RoundRepository()
    this.roomRepository =  new RoomRepository()
    this.playerRepository = new PlayerRepository()
    this.questionRepository = new QuestionRepository()
    this.answerRepository = new AnswerRepository()
  }

  listen() {
    this.handleAnswer()
  }

  handleAnswer() {
    this.socket.on('player_answer', (answer) => {

      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return 
      
      const answeredBy = room.getPlayerBySocketId(this.socket.id)
      if(!answeredBy) return 

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return 

      const currentQA = round.getCurrentQA()
      if(!currentQA) return


      const savedAnswer = new Answer(answer, round, answeredBy, currentQA.question!)

      round.setAnswer(savedAnswer)
  
      this.roundRepository.save(round)

      this.io.to(room.getId()).emit('player_answer', answer)

    })
  }

}