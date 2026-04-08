import { generateRoomId } from "../../utils/roomsHash.js"
import { Server, Socket } from 'socket.io'
import { socketRoomMap, roomMessagesMap } from './states.js'
import { getPlayersInRoom } from "../../utils/playersInRoom.js"
import { ConnectionListener } from "./connectionListener.js"
import { RoomRepository } from "../../repositories/roomRepository.js"
import { MessageRepository } from "../../repositories/messageRepository.js"
import Room from "../../models/room.js"


export class RoomConnectionListener extends ConnectionListener {
  private roomRepository: RoomRepository
  private messageRepository: MessageRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.messageRepository = new MessageRepository()
  }

  listen() {
    this.onCreateRoom()
    this.onJoinRoom()
    this.onDisconnect()
  }

  private onCreateRoom() {
    this.socket.on('create_room', () => {
      const room = new Room(this.socket.id)

      this.roomRepository.save(room)
     
      this.socket.join(room.getId())
      this.socket.emit('room_id', room.getId())
      this.socket.emit('display_players', [])
      this.roomRepository.save(room)
    })
  }

  private onJoinRoom() {
    this.socket.on('join_room', (data: { roomId: string }) => {
      const room = this.roomRepository.findById(data.roomId)
      
      if (!room) {
        this.socket.emit('room_error', 'Room not found')
        return
      }

      room.addPlayer(this.socket.id)

      this.roomRepository.save(room)

      this.socket.join(room.getId())
      this.socket.emit('room_id', room.getId())
      this.socket.emit('room_history', room.getMessageHistory())

      this.io.to(room.getId()).emit('display_players', getPlayersInRoom(this.io, room.getId()))
    })
  }

  private onDisconnect() {
      this.socket.on('disconnect', () => {
          const room = this.roomRepository.findBySocketId(this.socket.id)

          if (!room) return

          room.removePlayer(this.socket.id)

          if(room.getPlayers().length === 0) {
            this.roomRepository.delete(room)
          } else {
            this.roomRepository.save(room)
          }

          this.io.to(room.getId()).emit(
            'display_players',
            getPlayersInRoom(this.io, room.getId())
          )

      })
  }
}