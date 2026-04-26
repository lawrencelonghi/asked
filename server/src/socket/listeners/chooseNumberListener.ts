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

  scoreHandler() {
    this.socket.on('score_choosed', (score: Score) => {
      console.log(score);
      const room = this.roomRepository.findBySocketId(this.socket.id)

      if (!room) {
          console.log("room não encontrado para socket:", this.socket.id)
          return
      }

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return

      round.addScore(score)
      this.roundRepository.save(round)

      const mainPlayer = round.getMainPlayer()

      const allPlayersChossen = round.allPlayersChossen()
      
      if(allPlayersChossen) {
        const roundScore = round.getScore()
        const mainPlayer = round.getMainPlayer()
        const players = room.getPlayers()

        if(mainPlayer) {
          const firstToAnswer = round.getNextPlayerToAnswer(players, mainPlayer)
          this.io.to(room.getId()).emit('next_player_to_answer', firstToAnswer)
        }


        this.messageRepository.deleteByRoomId(room.getId())

        this.io
          .to(room.getId())
          .except(mainPlayer?.socketId ?? '')
          .emit('round_score', roundScore)  

        this.io
        .to(room.getId())
        .emit('questions_started', true)
      }
    })
  }
}