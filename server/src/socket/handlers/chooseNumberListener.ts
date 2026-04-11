import { ConnectionListener } from "./connectionListener.js";
import { RoomRepository } from "../../repositories/roomRepository.js";
import { type Server, type Socket } from 'socket.io'
import { Score } from "../../models/score.js";


export class chooseNumberConnectionListener extends ConnectionListener {
  roomRepository: RoomRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
  }

  listen() {
    this.scoreHandler()
  }

  scoreHandler() {
    this.socket.on('score_choosed', (score: Score) => {
      console.log(score);
      const playerRoomId = this.roomRepository.findBySocketId(this.socket.id)

      if (!playerRoomId) {
          console.log("room não encontrado para socket:", this.socket.id)
          return
      }

      playerRoomId.addScore(score)

      const mainPlayer = playerRoomId.calculateMainPlayer()
      const finalScore = playerRoomId.calculateScore()

      console.log('score escolhido foi:', finalScore);

      this.io
        .to(playerRoomId.getId())
        .except(mainPlayer?.socketId ?? '')
        .emit('final_score', finalScore)      
    })
  }
}