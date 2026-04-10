import { type Server, type Socket } from 'socket.io'
import { players, socketRoomMap, playersThatAreReady } from './states.js'
import { getPlayersInRoom } from '../../utils/playersInRoom.js'
import { Player } from '../../models/player.js'
import { ConnectionListener } from './connectionListener.js'

import { RoomRepository } from '../../repositories/roomRepository.js'

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

export class StartGameConnectionListener extends ConnectionListener {

  roomRepository: RoomRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
  }

  listen() {
    this.onStartGame()
  }

  onStartGame() {
    this.socket.on("player_ready", (playerReady) => {
      const playerRoomId = this.roomRepository.findBySocketId(this.socket.id)

      if (!playerRoomId) {
       console.log("room não encontrado para socket:", this.socket.id)
       return
       }

       playerRoomId.addPlayerReadyToPlay(playerReady)

       if(playerRoomId.allPlayersReadyToPlay()) {
        playerRoomId.gameStarted()
        return this.io.to(playerRoomId.getId()).emit('all_players_ready', true)
       }
    })
  }
}