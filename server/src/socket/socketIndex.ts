import { Server, Socket } from 'socket.io';
import { RoomConnectionListener } from './handlers/roomHandler.js';
import { MessageConnectionListener } from './handlers/messageHandler.js';
import { Server as HttpServer } from 'http'
import { PlayerConnetionListener } from './handlers/playerHandler.js';
import { VoteConnectionListener } from './handlers/voteHandler.js';

export class SocketConnectionService {
  io: Server

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    })
  }

  listen() {
      this.io.on('connection', (socket: Socket) => {
          console.log('player connected', socket.id)

          const roomListener = new RoomConnectionListener(this.io, socket)
          const messageListener = new MessageConnectionListener(this.io, socket)
          const playerListener = new PlayerConnetionListener(this.io, socket)
          const voteListener = new VoteConnectionListener(this.io, socket)

          roomListener.listen()
          messageListener.listen()
          playerListener.listen()
          voteListener.listen()
      })
  }
}