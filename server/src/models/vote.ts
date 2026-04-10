import type { Player } from "./player.js";

export class Vote {
  whoVoted: Player
  votedFor: Player

  constructor(whoVoted: Player, votedFor: Player) {
    this.whoVoted = whoVoted
    this.votedFor = votedFor
  }

}