import type { Player } from "./player.js";

export class Score {
  number: number
  whoChoosed: Player

  constructor(number: number, whoChoosed: Player) {
    this.number = number
    this.whoChoosed = whoChoosed
  }

}