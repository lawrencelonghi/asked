import { Server } from 'socket.io';
import { server } from '../server.js';
import { generateRoomId } from '../utils/roomsHash.js';
import { roomHandlers } from './handlers/roomHandler.js';
import { messageHandlers } from './handlers/messageHandler.js';
import { playerHandlers } from './handlers/playerHandler..js';

function socketService() {

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
  })
}

export default socketService