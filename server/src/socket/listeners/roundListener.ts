import type { Player } from "../../models/player.js";
import Room from "../../models/room.js";
import { Round } from "../../models/round.js";
import { MessageRepository } from "../../repositories/messageRepository.js";
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'


export class RoundListenerConnection extends ConnectionListener  {

  private roundRepository: RoundRepository
  private roomRepository: RoomRepository
  private messageRepository: MessageRepository


  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roundRepository = new RoundRepository()
    this.roomRepository = new RoomRepository()
    this.messageRepository = new MessageRepository()
    
  }

  listen() {
    this.startRound()
  }

  private startRound() {
    this.socket.on('start_round', (data) => {
      const room = this.roomRepository.findBySocketId(this.socket.id)

      if(!room) return

      if (!room.isRoomCreator(this.socket.id)) return

      const round = new Round(room) 

      this.roundRepository.save(round)

      room.startRound(round)
      this.roomRepository.save(room)

      this.messageRepository.deleteByRoomId(room.getId()) //nao esta deletando as mensagens
      console.log('round comecou');
      this.io.to(room.getId()).emit('round_started', true)
    })
  }
} 