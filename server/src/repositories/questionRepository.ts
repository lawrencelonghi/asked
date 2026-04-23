import { Player } from "../models/player.js";
import Room from "../models/room.js";
import { Round } from "../models/round.js";


export class QuestionRepository {
  player: Player
  room: Room
  round: Round

  constructor(player: Player, room: Room, round: Round) {
    this.player = player
    this.room = room
    this.round = round
  }

  save(message: string) {
    
  }
}