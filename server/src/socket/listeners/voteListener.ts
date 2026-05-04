import { type Server, type Socket } from 'socket.io'
import type { Vote } from '../../models/vote.js';
import { ConnectionListener } from './connectionListener.js';
import { RoomRepository } from '../../repositories/roomRepository.js';
import { RoundRepository } from '../../repositories/roundRepository.js';

export class VoteConnectionListener extends ConnectionListener {

  private roomRepository: RoomRepository
  private roundRepository: RoundRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.roundRepository = new RoundRepository()
  }

  listen() {
    this.voteHandler()
  }

  voteHandler() {
      this.socket.on("voted_player", (vote: Vote) => {
        console.log("voto recebido:", vote)

        const room = this.roomRepository.findBySocketId(this.socket.id)

        if (!room) {
          console.log("room não encontrado para socket:", this.socket.id)
          return
        }

        const round = this.roundRepository.findActiveByRoom(room)

        if (!round) {
          console.log("nenhum round ativo na sala")
          return
        }

        const voteAccepted = round.addVote(vote)
        if(!voteAccepted){
          console.log("jogador já votou");
        } 
      
        this.roundRepository.save(round)

        if (round.allPlayersVoted()) {
              const mainPlayer = round.getMainPlayer()
              this.io.to(room.getId()).emit("voting_result", mainPlayer)
        }
        
      })

  }


}