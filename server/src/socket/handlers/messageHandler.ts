import { Server, Socket } from 'socket.io'
import { roomMessagesMap } from './states.js'

interface Message {
  senderSocketID: string
  text: string
  timestamp: number
  senderName: string
}

export function messageHandlers(socket: Socket, io: Server) {
    // escuta quando o jogador manda mensagem pelo chat. Por padrao da lib cada player é automaticamente colocado em uma sala padrao que tem o nome do seu id. (on connect player.id = 'haha123', o socket.io nesse momento coloca esse player em uma room.id = 'haha123' por padrao) .filter elemina essa sala padrao e deixa apenas a sala que os outros players vao poder se conectar. const roomId = playerRooms[0] seleciona essa sala que restou, que é a correta. Se existir o room envia a mensagem para todos no room inclusive para o proprio player
    socket.on('send_message', (data) => {
      const playerRooms = [...socket.rooms].filter(r => r !== socket.id)
      const roomId = playerRooms[0]
      
      if (roomId) {
        const existingMessages = roomMessagesMap.get(roomId) || []
        roomMessagesMap.set(roomId, [...existingMessages, data])
        io.to(roomId).emit('receive_message', data)
      }
    })
}