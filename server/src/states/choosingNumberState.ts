import type { RoundState } from "./roundStateInterface.js";
import { Round } from "../models/round.js";
import { Player } from "../models/player.js";
import { Score } from "../models/score.js";
import { Server, Socket } from 'socket.io'
import { QAState } from "./QAState.js";


// src/states/ChoosingNumberState.ts
// Main player está pausado — os OUTROS escolhem um número 0-10
export class ChoosingNumberState implements RoundState {
  readonly name = "choosing_number"

  onScoreChoosed(round: Round, score: number, player: Player, io: Server, roomId: string) {
    round.addScore(new Score(score, player))

    if (round.allPlayersChossen()) {
      const secretNumber = round.getScore()
      const mainPlayer   = round.getMainPlayer()
      const players      = round.getRoom().getPlayers()
      const firstToAnswer = round.getNextPlayerToAnswer(players, mainPlayer!)

      // Limpa chat e avisa que as perguntas vão começar
      io.to(roomId).emit("questions_started", true)
      io.to(roomId).emit("next_player_to_answer", firstToAnswer)

      round.setState(new QAState())
    }
  }

  onVote()     {}
  onQuestion() {}
  onAnswer()   {}
  onGuess()    {}
}