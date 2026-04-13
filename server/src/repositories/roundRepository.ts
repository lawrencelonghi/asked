import { roundList } from "../storage/storage.js";
import { Round } from "../models/round.js";

export class RoundRepository {
  roundList: Round[]

  constructor() {
    this.roundList = roundList
  }

  findByRoom() {
    
  }
}