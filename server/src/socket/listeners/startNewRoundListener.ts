import { Round } from "../../models/round.js";
import { MessageRepository } from "../../repositories/messageRepository.js";
import { RoomRepository } from "../../repositories/roomRepository.js";
import { RoundRepository } from "../../repositories/roundRepository.js";
import { ConnectionListener } from "./connectionListener.js";
import { Server, Socket } from 'socket.io'


export class StartNewRoundListenerConnection extends ConnectionListener  {

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
    this.startNewRound()
  }

  private startNewRound() {
    this.socket.on('start_new_round', () => {
      const room = this.roomRepository.findBySocketId(this.socket.id)
      if(!room) return

      if (!room.isRoomCreator(this.socket.id)) return

      const round = this.roundRepository.findActiveByRoom(room)
      if(!round) return

      const newRound = new Round(room)

      this.roundRepository.save(newRound)

      room.startRound(newRound)

      this.roomRepository.save(room)

      this.messageRepository.deleteByRoomId(room.getId()) 

      this.io.to(room.getId()).emit('round_started', false)
      this.io.to(room.getId()).emit('new_round_started', true)
      console.log('novo round comecou');
      
    })
  }
} 