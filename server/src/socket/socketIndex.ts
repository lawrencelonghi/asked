import { Server, Socket } from 'socket.io';
import { RoomConnectionListener } from './listeners/roomListener.js';
import { MessageConnectionListener } from './listeners/messageListener.js';
import { Server as HttpServer } from 'http'
import { PlayerConnetionListener } from './listeners/playerListener.js';
import { VoteConnectionListener } from './listeners/voteListener.js';
import { StartGameConnectionListener } from './listeners/startGameListener.js';
import { chooseNumberConnectionListener } from './listeners/chooseNumberListener.js';
import { RoundListenerConnection } from './listeners/roundListener.js';

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
          const startGameListener = new StartGameConnectionListener(this.io, socket)
          const chooseNumberListener = new chooseNumberConnectionListener(this.io, socket)
          const roundListener = new RoundListenerConnection(this.io, socket)

          roomListener.listen()
          roundListener.listen()
          messageListener.listen()
          playerListener.listen()
          voteListener.listen()
          startGameListener.listen()
          chooseNumberListener.listen()
      })
  }
}