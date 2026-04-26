import { type Server, type Socket } from 'socket.io'
import { ConnectionListener } from './connectionListener.js'
import { MessageRepository } from '../../repositories/messageRepository.js'
import { RoomRepository } from '../../repositories/roomRepository.js'
import Message from '../../models/message.js'

export class MessageConnectionListener extends ConnectionListener {
    private messageRepository: MessageRepository
    private roomRepository: RoomRepository

    constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.messageRepository = new MessageRepository()
    this.roomRepository = new RoomRepository()
    }

    listen() {
      this.onSendMessage()
    }

    private onSendMessage() {
          this.socket.on('send_message', (data) => {
              const room = this.roomRepository.findBySocketId(this.socket.id)
              if (!room) return

              const message = new Message(
                data.content, 
                data.senderId, 
                data.senderName,
                data.timestamp
              )

              this.messageRepository.save(message)
              room.addMessage(message)
              this.roomRepository.save(room)

              this.io.to(room.getId()).emit('receive_message', message)
          })
    }
}

