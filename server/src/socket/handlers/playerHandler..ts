import { type Server, type Socket } from 'socket.io'
import { players, socketRoomMap } from './states.js'
import { getPlayersInRoom } from '../../utils/playersInRoom.js'

export function playerHandlers(socket: Socket, io: Server) {
    //escuta quando jogador digita o nome na tela inicial. adiciona um socketId ao novo player, coloca ele na lista de players e faz o processo de limpar o room default que a lib atribui para cada jogador para entao saber qual sala o jogador está. Mostra os jogadores na sala incluindo o proprio 
    socket.on('send_player', (data) => {
      const playerWithSocket = { ...data, socketId: socket.id }
      players.push(playerWithSocket)

      const playerRooms = [...socket.rooms].filter(r => r !== socket.id)
      const roomId = playerRooms[0]

      if (roomId) {
        io.to(roomId).emit('display_players', getPlayersInRoom(io, roomId))
      }
    })

  socket.on('disconnect', () => {
      const roomId = socketRoomMap.get(socket.id)
      socketRoomMap.delete(socket.id)

      const index = players.findIndex((p) => p.socketId === socket.id)
      if (index !== -1) players.splice(index, 1)

      if (roomId) {
        io.to(roomId).emit('display_players', getPlayersInRoom(io, roomId))
      }
    })
}