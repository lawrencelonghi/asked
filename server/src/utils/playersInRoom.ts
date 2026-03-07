import { Server } from 'socket.io'
import { players } from '../socket/handlers/states.js'

export function getPlayersInRoom(io: Server, roomId: string) {
    return players.filter(p => {
      const activeSocket = io.sockets.sockets.get(p.socketId)
      return activeSocket?.rooms.has(roomId)
    })
  }