import { ConnectionListener } from "./connectionListener.js";
import { type Server, type Socket } from 'socket.io'
import { Round } from "../../models/round.js";
import Room from "../../models/room.js";
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";

export class GuessConnectionListener extends ConnectionListener {
  private roomRepository: RoomRepository
  private roundRepository: RoundRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.roundRepository = new RoundRepository()
  }

  listen(): void {
    this.handleGuess()
  }

  private handleGuess() {
    this.socket.on('mainPlayer_guess', (guess) => {
      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return 

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return

      const score = round.getScore()
      if(!score) return 

      const isMainPlayerWinner = round.isMainPlayerWinner(guess)

      this.io.to(room.getId()).emit('isMainPlayer_winner', isMainPlayerWinner)
      
      if(isMainPlayerWinner) {
        console.log('mainPlayer acertou');
      } else {
        console.log('mainPlayer errou'); 
      }
      
    })
  }
}