// import type { Player } from "../models/player.js";
// import type Room from "../models/room.js";
// import { playerList, roomList } from "../storage/storage.js";


// export class PlayerRepository {
//   playerList: Player[]
//   roomList: Room[]

//   constructor() {
//     this.playerList = playerList
//     this.roomList = roomList
//   }

//   findById(id: string): Player | null {
//     return this.playerList.find(player => player.socketId === id) ?? null 
//   }

//   save(player: player): PlayerRepository {
//     const index = this.playerList.findIndex(p => p.socketId === player.getId())
//   }

// }