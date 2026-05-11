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

  private voteHandler() {
    this.socket.on("voted_player", (vote: Vote) => {
      const room  = this.roomRepository.findBySocketId(this.socket.id)
      const round = room && this.roundRepository.findActiveByRoom(room)
      if (!room || !round) return

      round.handleVote(vote, this.io, room.getId())
      this.roundRepository.save(round)
    })
  }
}