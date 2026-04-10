import { type Server, type Socket } from 'socket.io'
import { votingList } from './states.js';
import { getPlayersInRoom } from '../../utils/playersInRoom.js';
import { socketRoomMap } from './states.js';
import type { Player } from '../../models/player.js';
import type Room from '../../models/room.js';
import type { Vote } from '../../models/vote.js';
import { voteList } from '../../storage/storage.js';
import { ConnectionListener } from './connectionListener.js';
import { RoomRepository } from '../../repositories/roomRepository.js';


// export function voteHandler(socket: Socket, io: Server) {
//   socket.on("voted_player", (vote: Vote) => {
//     console.log("voto recebido:", vote)

//     const roomId = socketRoomMap.get(socket.id) // pega o roomId do jogador

//     if (!roomId) {
//       console.log("roomId não encontrado para socket:", socket.id)
//       return
//     }
  
//     const currentVotes = votingList.get(roomId) ?? []
//     const alreadyVoted = currentVotes.some(v => v.whoVoted.socketId === vote.whoVoted.socketId)

//     if(alreadyVoted) {
//       console.log("jogador já votou, ignorando")
//       return
//     }

//     currentVotes.push(vote)
//     votingList.set(roomId, currentVotes)

//     const totalPlayers = getPlayersInRoom(io, roomId).length
//     console.log(`votos: ${currentVotes.length} | total jogadores: ${totalPlayers}`)

//     if (currentVotes.length === totalPlayers) {
//       const mainPlayer = setMainPlayer(currentVotes, roomId, io)
//       console.log("vencedor:", mainPlayer)
//       io.to(roomId).emit("voting_result", mainPlayer) 
//     }
//   })
// }

// export function setMainPlayer(votes: Vote[], roomId: string, io: Server): Player | null {
//   const voteCount = new Map<string, { player: Player, count: number }>()

//   for (const vote of votes) {
//     const { socketId } = vote.votedFor
//     const current = voteCount.get(socketId)

//     if (current) {
//       current.count++
//     } else {
//       voteCount.set(socketId, { player: vote.votedFor, count: 1 })
//     }
//   }

//   // pega o mais votado independente de maioria absoluta
//   let winner: Player | null = null
//   let maxVotes = 0

//   for (const { player, count } of voteCount.values()) {
//     if (count > maxVotes) {
//       maxVotes = count
//       winner = player
//     }
//   }

//   return winner
// }

export class VoteConnectionListener extends ConnectionListener {

  roomRepository: RoomRepository

  constructor(io: Server, socket: Socket) {
    super(io, socket)
    this.roomRepository = new RoomRepository()
  }

  listen() {
    this.voteHandler()
  }

  voteHandler() {
      this.socket.on("voted_player", (vote: Vote) => {
        console.log("voto recebido:", vote)

        const playerRoomId = this.roomRepository.findBySocketId(this.socket.id)

        if (!playerRoomId) {
          console.log("room não encontrado para socket:", this.socket.id)
          return
        }

        const voteAccepted = playerRoomId.addVote(vote)
        if(!voteAccepted){
          console.log("jogador já votou");
        } 
      
        const mainPlayer = playerRoomId.calculateMainPlayer()
        this.io.to(playerRoomId.getId()).emit("voting_result", mainPlayer)
        console.log(mainPlayer)
        
      })

  }


}