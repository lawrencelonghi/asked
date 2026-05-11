import type { GameState } from "../states/roundStateInterface.js"

export class Game {
  private state: GameState
    constructor() {
     
      this.state = new RoundStarted()
  }
}