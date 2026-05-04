import { type Server, type Socket } from 'socket.io'
import { ConnectionListener } from './connectionListener.js'
import { RoomRepository } from '../../repositories/roomRepository.js'
import { RoundRepository } from '../../repositories/roundRepository.js'

export class StartGameConnectionListener extends ConnectionListener {

  private roomRepository: RoomRepository
  private roundRepository: RoundRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
    this.roundRepository = new RoundRepository()
  }

  listen() {
    this.onStartGame()
  }

  onStartGame() {
    this.socket.on("player_ready", (playerReady) => {
      const room = this.roomRepository.findBySocketId(this.socket.id)

      if (!room) {
       console.log("room não encontrado para socket:", this.socket.id)
       return
      }

      const round = this.roundRepository.findActiveByRoom(room)
      if (!round) return

      round.addPlayerReadyToPlay(playerReady)
      this.roundRepository.save(round)

      if(round.allPlayersReadyToPlay()) {
        // round.gameStarted()
        return this.io.to(room.getId()).emit('all_players_ready', true)
      }
    })
  }
}