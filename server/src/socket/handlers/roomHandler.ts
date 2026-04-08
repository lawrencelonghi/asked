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

      this.socket.join(room.getId())
      this.socket.emit('room_id', room.getId())
      this.socket.emit('room_history', room.getMessageHistory())

      // notifica TODOS na sala, incluindo quem já estava
      this.io.to(room.getId()).emit('display_players', getPlayersInRoom(this.io, room.getId()))
    })
  }

  private onDisconnect() {
      this.socket.on('disconnect', () => {
          const room = this.roomRepository.findBySocketId(this.socket.id)

          if (!room) return

          this.messageRepository.deleteByRoomId(room.getId()) 
          this.roomRepository.deleteBySocketId(this.socket.id) 
      })
  }
}