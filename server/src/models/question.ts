import type { Answer } from "./answer.js";
import type { Player } from "./player.js";
import type { Round } from "./round.js";

export class Question {
  content: string;
  round: Round;
  askedTo: Player;

  constructor(content: string, round: Round, askedTo: Player) {
    this.content = content;
    this.round = round;
    this.askedTo = askedTo;
  }
}