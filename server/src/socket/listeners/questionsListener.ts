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

  handleQuestion() {
    this.socket.on('mainPlayer_question', (data) => {
      const mainPlayerQuestion = data
      
      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return

      const players = this.playerRepository.getPlayersByRoom(room)
      if(!players) return 

      const mainPlayer = round?.getMainPlayer()
      if(!mainPlayer) return

      

      const nextPlayerToAnswer = round.getNextPlayerToAnswer(players, mainPlayer)
      if(!nextPlayerToAnswer) return console.log('a rodada acabou');

      const savedQuestion = new Question(mainPlayerQuestion, nextPlayerToAnswer)

      //inicia par pergunta/resposta indicando quem deve responder
      round.startQA(nextPlayerToAnswer)

      round.setQuestion(savedQuestion)

      const qaList = round.getQAList()

      this.io.to(room.getId()).emit('next_player_to_answer', nextPlayerToAnswer)
      this.io.to(room.getId()).emit('main_player_question', mainPlayerQuestion)
      this.io.to(room.getId()).emit('qa_list', qaList)


      this.roundRepository.save(round)

      console.log('a pergunta é:', mainPlayerQuestion, 'e quem deve responder é:', nextPlayerToAnswer.name);
      
    })
  }
}