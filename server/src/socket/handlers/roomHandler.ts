import { generateRoomId } from "../../utils/roomsHash.js"
import { Server, Socket } from 'socket.io'
import { socketRoomMap, roomMessagesMap } from './states.js'
import { getPlayersInRoom } from "../../utils/playersInRoom.js"

export function roomHandlers(socket: Socket, io: Server) {
  //escuta quando o jogador clica em create room. funcao cria um room (com hash), joga o usuario nesse room, envia o hash do room para usuario poder compartilhar e mostra quais jogadores estao no room
  socket.on('create_room', () => {
    const roomId = generateRoomId()
    socket.join(roomId)
    socketRoomMap.set(socket.id, roomId)
    socket.emit('room_id', roomId)
    socket.emit('display_players', [])
  }),

  //escuta quando o jogador clica em join room e digita o hash enviado por outro jogador. data é o hash que o jogador digito no campo de room (enviado por outro jogador que criou o room), verifica se o room existe, se existir faz o join do jogador no room e guarda a informacao jogador-room (RoomMap.set), manda o hash do room para o novo jogador, pega o historico de mensagens da sala e mostra os jogadores presentes na sala
  socket.on('join_room', (data: { roomId: string }) => {
    const rooms = io.sockets.adapter.rooms

    if (!rooms.has(data.roomId)) {
      socket.emit('room_error', 'Room not found')
      return
    }

    socket.join(data.roomId)
    socketRoomMap.set(socket.id, data.roomId)
    socket.emit('room_id', data.roomId)

    const messagesHistory = roomMessagesMap.get(data.roomId) || []
    socket.emit('room_history', messagesHistory)

    socket.emit('display_players', getPlayersInRoom(io, data.roomId))
    
  })
}
