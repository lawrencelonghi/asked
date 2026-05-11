import type { RoundState } from "./roundStateInterface.js";
import { Round } from "../models/round.js";
import { Player } from "../models/player.js";
import { Server } from 'socket.io'
import { Question } from "../models/question.js";
import { Answer } from "../models/answer.js";
import { GuessingState } from "./guessingState.js";
// src/states/QAState.ts
// Main player pergunta → jogador responde → repete até todos responderem
export class QAState implements RoundState {
  readonly name = "qa"

  onQuestion(round: Round, content: string, io: Server, roomId: string) {
    const players    = round.getRoom().getPlayers()
    const mainPlayer = round.getMainPlayer()!
    const nextPlayer = round.getNextPlayerToAnswer(players, mainPlayer)

    if (!nextPlayer) return // todos já responderam

    const question = new Question(content, nextPlayer)
    round.startQA(nextPlayer)
    round.setQuestion(question)

    io.to(roomId).emit("next_player_to_answer", nextPlayer)
    io.to(roomId).emit("main_player_question", content)
    io.to(roomId).emit("qa_list", round.getQAList())
  }

  onAnswer(round: Round, content: string, player: Player, io: Server, roomId: string) {
    const currentQA = round.getCurrentQA()
    if (!currentQA) return

    const answer = new Answer(content, player, currentQA.question!)
    round.setAnswer(answer)

    const players    = round.getRoom().getPlayers()
    const mainPlayer = round.getMainPlayer()!
    const nextPlayer = round.getNextPlayerToAnswer(players, mainPlayer)

    io.to(roomId).emit("player_answer", content)
    io.to(roomId).emit("qa_list", round.getQAList())

    if (!nextPlayer) {
      // Todos responderam → main player pode chutar
      io.to(roomId).emit("start_guess", true)
      round.setState(new GuessingState())
    } else {
      io.to(roomId).emit("next_player_to_answer", nextPlayer)
    }
  }

  onVote()         {}
  onScoreChoosed() {}
  onGuess()        {}
}