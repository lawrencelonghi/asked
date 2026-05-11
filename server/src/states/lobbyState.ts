import type { RoundState } from "./roundStateInterface.js"

export class LobbyState implements RoundState {
  readonly name = "lobby"

  // Lobby só sabe começar — nada mais
  onVote()         { console.warn("Votação ainda não começou") }
  onScoreChoosed() {}
  onQuestion()     {}
  onAnswer()       {}
  onGuess()        {}
}