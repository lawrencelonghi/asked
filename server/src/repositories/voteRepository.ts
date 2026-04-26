import { Player } from "../models/player.js";
import Room from "../models/room.js";
import { voteList } from "../storage/storage.js";
import { Vote } from "../models/vote.js";

export class VoteRepository {
  player: Player
  room: Room
  voteList: Vote[]

  constructor(player: Player, room: Room, ) {
    this.player = player
    this.room = room
    this.voteList = voteList
  }

}