import { Answer } from "./answer.js";
import type { Player } from "./player.js";
import type { Round } from "./round.js";

export class Question {
  content: string;
  askedTo: Player;
  answer?: Answer

  constructor(content: string, askedTo: Player) {
    this.content = content;
    this.askedTo = askedTo;
  }

}