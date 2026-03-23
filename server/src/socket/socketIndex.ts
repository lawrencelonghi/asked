import { Server, Socket } from 'socket.io';
import { generateRoomId } from '../utils/roomsHash.js';
import { RoomConnectionListener, roomHandlers } from './handlers/roomHandler.js';
import { messageHandlers } from './handlers/messageHandler.js';
import { playerHandlers } from './handlers/playerHandler..js';
import { voteHandler } from './handlers/voteHandler.js';
import { startGame } from './handlers/startGameHandler.js';
import { socketRoomMap } from './handlers/states.js';
import { Server as HttpServer } from 'http'

function socketService(server: HttpServer) {

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

// funcao principal 
  io.on("connection", (socket) => {
    console.log('player connected', socket.id)

    roomHandlers(socket, io)
    messageHandlers(socket, io)
    playerHandlers(socket, io)
    voteHandler(socket, io)
    startGame(socket, io)
  })
}

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
      (new RoomConnectionListener(this.io, socket)).listen()
    })
  }
}

export default socketService