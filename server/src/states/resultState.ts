import type { RoundState } from "./roundStateInterface.js"

export class ResultState implements RoundState {
  readonly name = "result"

  // Resultado — só aguarda comando de novo round (vem do roomListener, não do state)
  onVote()         {}
  onScoreChoosed() {}
  onQuestion()     {}
  onAnswer()       {}
  onGuess()        {}
}