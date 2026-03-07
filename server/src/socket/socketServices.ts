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

  //map de mensagens por sala
  const roomMessagesMap = new Map<string, Array<{
    senderSocketID: string; text: string; timestamp: number; senderName: string;
  }>>()

  function getPlayersInRoom(roomId: string) {
    return players.filter(p => {
      const activeSocket = io.sockets.sockets.get(p.socketId)
      return activeSocket?.rooms.has(roomId)
    })
  }

  const socketRoomMap = new Map<string, string>()

// funcao principal 
  io.on("connection", (socket) => {
    console.log('player connected', socket.id)

    //escuta quando o jogador clica em create room. funcao cria um room (com hash), joga o usuario nesse room, envia o hash do room para usuario poder compartilhar e mostra quais jogadores estao no room
    socket.on('create_room', () => {
      const roomId = generateRoomId()
      socket.join(roomId)
      socketRoomMap.set(socket.id, roomId)
      socket.emit('room_id', roomId)
      socket.emit('display_players', [])
    })

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

      socket.emit('display_players', getPlayersInRoom(data.roomId))
      
    })

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

    //escuta quando jogador digita o nome na tela inicial. adiciona um socketId ao novo player, coloca ele na lista de players e faz o processo de limpar o room default que a lib atribui para cada jogador para entao saber qual sala o jogador está. Mostra os jogadores na sala incluindo o proprio 
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