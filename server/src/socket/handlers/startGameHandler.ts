import { type Server, type Socket } from 'socket.io'
import { players, socketRoomMap, playersThatAreReady } from './states.js'
import { getPlayersInRoom } from '../../utils/playersInRoom.js'
import type { Player } from '../../../../types.js'

export function startGame(socket: Socket, io: Server) {
  
socket.on('player_ready', (player: Player) => {
  const roomId = socketRoomMap.get(socket.id)
  if (!roomId) return

  const currentPlayersReady = playersThatAreReady.get(roomId) ?? []
  
  const alreadyReady = currentPlayersReady.some(p => p.socketId === player.socketId)
  if (alreadyReady) {
    return
  }

  currentPlayersReady.push(player)
  playersThatAreReady.set(roomId, currentPlayersReady)

  const totalPlayers = getPlayersInRoom(io, roomId).length

  if (currentPlayersReady.length === totalPlayers) {
    io.to(roomId).emit("all_players_ready", true)
    console.log('all_players_ready!')
  }
})
}