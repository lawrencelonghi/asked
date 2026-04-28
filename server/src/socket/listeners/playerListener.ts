import { type Server, type Socket } from 'socket.io'
import { ConnectionListener } from './connectionListener.js'
import { RoomRepository } from '../../repositories/roomRepository.js'
import { playerList } from '../../storage/storage.js'


export class PlayerConnetionListener extends ConnectionListener {
  private roomRepository: RoomRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
  } 

  listen() {
    this.onSendPlayer()
    this.onDisconnect()
  }

  private onSendPlayer() {
      this.socket.on('send_player', (data) => {
          const playerWithSocket = { ...data, socketId: this.socket.id }
          playerList.push(playerWithSocket)          

          const room = this.roomRepository.findBySocketId(this.socket.id)
          if (!room) return

          this.io.to(room.getId()).emit('display_players', room.getPlayers())
          
      })
  }

  private onDisconnect() {
    this.socket.on('disconnect', () => {
        const room = this.roomRepository.findBySocketId(this.socket.id)

        const index = playerList.findIndex((p) => p.socketId === this.socket.id)
        if (index !== -1) playerList.splice(index, 1)

        if (!room) return

        this.roomRepository.deleteBySocketId(this.socket.id)
        this.io.to(room.getId()).emit('display_players', room.getPlayers())
    })
  }
}