import { type Server, type Socket } from 'socket.io'
import { ConnectionListener } from './connectionListener.js'
import { RoomRepository } from '../../repositories/roomRepository.js'
import { getPlayersInRoom } from '../../utils/playersInRoom.js'
import { players } from './states.js'


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
          players.push(playerWithSocket)          

          const room = this.roomRepository.findBySocketId(this.socket.id)
          if (!room) return

          this.io.to(room.getId()).emit('display_players', getPlayersInRoom(this.io, room.getId()))
          
      })
  }

  private onDisconnect() {
    this.socket.on('disconnect', () => {
        const room = this.roomRepository.findBySocketId(this.socket.id)

        const index = players.findIndex((p) => p.socketId === this.socket.id)
        if (index !== -1) players.splice(index, 1)

        if (!room) return

        this.roomRepository.deleteBySocketId(this.socket.id)
        this.io.to(room.getId()).emit('display_players', getPlayersInRoom(this.io, room.getId()))
    })
  }
}