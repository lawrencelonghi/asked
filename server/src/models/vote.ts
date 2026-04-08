import type { Player } from "./player.js";

export class Vote {
  player: Player

  constructor(player: Player) {
    this.player = player
  }

  whoVoted() {
    return this.player.getById()
  }

  votedFor() {
    return this.player.getById()
  }
}