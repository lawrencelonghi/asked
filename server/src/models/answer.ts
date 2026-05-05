import type { Player } from "./player.js";
import type { Question } from "./question.js";
import type { Round } from "./round.js";

export class Answer {
  content: string;
  answeredBy: Player;
  questionAnswered: Question

  constructor(content: string, answeredBy: Player, questionAnswered: Question) {
    this.content = content;
    this.answeredBy = answeredBy;
    this.questionAnswered = questionAnswered
  }
}