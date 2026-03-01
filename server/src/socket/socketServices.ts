import { Server } from 'socket.io';
import { server } from '../server.js';
import { generateRoomId } from '../helpers/roomsHash.js';

function socketService() {

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  let players: Array<{id: number, name: string, socketId: string}> = []

  function getPlayersInRoom(roomId: string) {
    return players.filter(p => {
      const activeSocket = io.sockets.sockets.get(p.socketId)
      return activeSocket?.rooms.has(roomId)
    })
  }

  const socketRoomMap = new Map<string, string>()


  io.on("connection", (socket) => {
    console.log('player connected', socket.id)

    socket.on('create_room', () => {
      const roomId = generateRoomId()
      socket.join(roomId)
      socketRoomMap.set(socket.id, roomId)
      socket.emit('room_id', roomId)
      socket.emit('display_players', [])
    })

    socket.on('join_room', (data: { roomId: string }) => {
      const rooms = io.sockets.adapter.rooms

      if (!rooms.has(data.roomId)) {
        socket.emit('room_error', 'Room not found')
        return
      }

      socket.join(data.roomId)
      socketRoomMap.set(socket.id, data.roomId)
      socket.emit('room_id', data.roomId)
      socket.emit('display_players', getPlayersInRoom(data.roomId))
    })

    socket.on('send_message', (data) => {
      const playerRooms = [...socket.rooms].filter(r => r !== socket.id)
      const roomId = playerRooms[0]
      if (roomId) {
        io.to(roomId).emit('receive_message', data)
      }
    })

    socket.on('send_player', (data) => {
      const playerWithSocket = { ...data, socketId: socket.id }
      players.push(playerWithSocket)

      const playerRooms = [...socket.rooms].filter(r => r !== socket.id)
      const roomId = playerRooms[0]

      if (roomId) {
        io.to(roomId).emit('display_players', getPlayersInRoom(roomId))
      }
    })

  socket.on('disconnect', () => {
    const roomId = socketRoomMap.get(socket.id) // ← pega a sala salva
    socketRoomMap.delete(socket.id)
    players = players.filter(p => p.socketId !== socket.id)

    if (roomId) {
      io.to(roomId).emit('display_players', getPlayersInRoom(roomId))
    }
  })
  })
}

export default socketService