import { generateRoomId } from "../../utils/roomsHash.js"
import { Server, Socket } from 'socket.io'
import { getPlayersInRoom } from "../../utils/playersInRoom.js"
import { ConnectionListener } from "./connectionListener.js"
import { RoomRepository } from "../../repositories/roomRepository.js"
import { MessageRepository } from "../../repositories/messageRepository.js"
import Room from "../../models/room.js"
import { Round } from "../../models/round.js"
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
    this.socket.on('create_room', (data) => {
        const room = new Room(this.socket.id)
        const player = new Player(data.name, this.socket.id)

        room.addPlayer(player)
        this.roomRepository.save(room)

        this.socket.join(room.getId())
        this.socket.emit('room_id', room.getId())
        this.socket.emit('room_creator', player) // ← emite o player criador
        this.socket.emit('display_players', room.getPlayers())
        console.log(`o criador da sala é:`, room.getRoomCreatorPlayer());
        
    })
    
}

private onJoinRoom() {
    this.socket.on('join_room', (data: { roomId: string, name: string }) => {
        const room = this.roomRepository.findById(data.roomId)

        if (!room) {
            this.socket.emit('room_error', 'Room not found')
            return
        }

        const round = this.roundRepository.findActiveByRoom(room)
        if (round) {
            this.socket.emit('room_error', 'You are late. Game already started')
            return
        }

        const player = new Player(data.name, this.socket.id)
        room.addPlayer(player)
        this.roomRepository.save(room)

        this.socket.join(room.getId())
        this.socket.emit('room_id', room.getId())
        this.socket.emit('room_creator', room.getRoomCreatorPlayer()) // ← mesmo formato
        this.socket.emit('room_history', room.getMessageHistory())        

        this.io.to(room.getId()).emit('display_players', room.getPlayers())
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