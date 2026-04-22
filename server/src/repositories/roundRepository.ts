import { roundList } from "../storage/storage.js";
import { roomList } from "../storage/storage.js";
import { Round } from "../models/round.js";
import Room from "../models/room.js";

export class RoundRepository {
  roundList: Round[]
  roomList: Room[]

  constructor() {
    this.roundList = roundList
    this.roomList = roomList
  }

  findByRoom(room: Room): Round | undefined {
    return this.roundList.find(r => r.getRoom().getId() === room.getId())
  }
}