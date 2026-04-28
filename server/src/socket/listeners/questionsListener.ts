import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { PlayerRepository } from "../../repositories/playerRepository.js"
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'
import { QuestionRepository } from "../../repositories/questionRepository.js";

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

  handleQuestion() {
    this.socket.on('mainPlayer_question', (data) => {
      const mainPlayerQuestion = data
      
      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return

      const players = this.playerRepository.getPlayersByRoom(room)
      const mainPlayer = round?.getMainPlayer()
      if(!mainPlayer) return

      const nextPlayerToAnswer = round.getNextPlayerToAnswer(players, mainPlayer)
      if(!nextPlayerToAnswer) {
        return console.log('a rodada acabou');
      }

      this.questionRepository.save(data, round, nextPlayerToAnswer)

      this.io.to(room.getId()).emit('next_player_to_answer', nextPlayerToAnswer)
      this.io.to(room.getId()).emit('main_player_question', mainPlayerQuestion)

      round.markPlayerAsAnswered(nextPlayerToAnswer)

      this.roundRepository.save(round)

      console.log('a pergunta foi:', mainPlayerQuestion, 'e quem tem que responder é:', nextPlayerToAnswer);

      
    })
  }
}