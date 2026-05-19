import { Server, Socket } from 'socket.io'
import { ConnectionListener } from "./connectionListener.js"
import { RoomRepository } from "../../repositories/roomRepository.js"
import { MessageRepository } from "../../repositories/messageRepository.js"
import Room from "../../models/room.js"
import { RoundRepository } from "../../repositories/roundRepository.js"
import { Player } from "../../models/player.js"


export class RoomConnectionListener extends ConnectionListener {
  private roomRepository: RoomRepository
  private messageRepository: MessageRepository
  private roundRepository: RoundRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.messageRepository = new MessageRepository()
    this.roundRepository = new RoundRepository()
  }

  listen() {
    this.onCreateRoom()
    this.onJoinRoom()
    this.onDisconnect()
  }

private onCreateRoom() {
    this.socket.on('create_room', async (data) => {
        const room = new Room(this.socket.id)
        const player = new Player(data.name, this.socket.id)

        room.addPlayer(player)
        await this.roomRepository.save(room)

        this.socket.join(room.getId())
        this.socket.emit('room_id', room.getId())
        this.socket.emit('room_creator', player) // ← emite o player criador
        this.socket.emit('display_players', room.getPlayers())        
    })
    
}

private onJoinRoom() {
    this.socket.on('join_room', async (data: { roomId: string, name: string }) => {
        const room = await this.roomRepository.findById(data.roomId)

        if (!room) {
            this.socket.emit('room_error', 'Room not found')
            return
        }

        const round = await this.roundRepository.findActiveByRoom(room)
        if (round) {
            this.socket.emit('room_error', 'You are late. Game already started')
            return
        }

        const player = new Player(data.name, this.socket.id)
        room.addPlayer(player)
        await this.roomRepository.save(room)

        this.socket.join(room.getId())
        this.socket.emit('room_id', room.getId())
        this.socket.emit('room_creator', room.getRoomCreatorPlayer()) // ← mesmo formato
        this.socket.emit('room_history', room.getMessageHistory())        

        this.io.to(room.getId()).emit('display_players', room.getPlayers())
    })
}

  private onDisconnect() {
      this.socket.on('disconnect', async () => {
          const room = await this.roomRepository.findBySocketId(this.socket.id)

          if (!room) return

          room.removePlayer(this.socket.id)

          if(room.getPlayers().length === 0) {
            await this.roomRepository.delete(room)
          } else {
            await this.roomRepository.save(room)
          }

          this.io.to(room.getId()).emit(
            'display_players',
            room.getPlayers()
          )

      })
  }
}