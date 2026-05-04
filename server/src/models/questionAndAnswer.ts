import type { Answer } from "./answer.js"
import type { Player } from "./player.js"
import type { Question } from "./question.js"

export class QuestionAndAnswer {
  question: Question | null = null
  answer: Answer | null = null
  askedTo: Player

  constructor(askedTo: Player) {
    this.askedTo = askedTo
  }

  isComplete(): boolean {
    return this.question !== null && this.answer !== null
  }
}