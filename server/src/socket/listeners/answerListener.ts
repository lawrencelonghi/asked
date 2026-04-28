import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { PlayerRepository } from "../../repositories/playerRepository.js"
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'
import { QuestionRepository } from "../../repositories/questionRepository.js";
import { AnswerRepository } from "../../repositories/answerRepository.js";

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

      const answeredBy = this.playerRepository.findById(this.socket.id)
      if(!answeredBy) return

      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return

      const question = this.questionRepository.findByPlayerAndRound(answeredBy, round)
      if(!question) return

      const savedAnswer = this.answerRepository.save(answer, round, answeredBy, question)
      //conecta a resposta a pergunta
      question.answer = savedAnswer

      round.markPlayerAsAnswered(answeredBy)
  
      
      this.roundRepository.save(round)

      this.io.to(room.getId()).emit('player_answer', answer)

      console.log('player marcado como JA RESPONDEU e a resposta foi:', savedAnswer);
    })
  }

}