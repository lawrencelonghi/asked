import type { Round } from "../models/round.js";
import type { RoundState } from "./roundStateInterface.js";
import { Vote } from "../models/vote.js";
import { Server, Socket } from 'socket.io'
import { ChoosingNumberState } from "./choosingNumberState.js";

// src/states/VotingState.ts
export class VotingState implements RoundState {
  readonly name = "voting"

  onVote(round: Round, vote: Vote, io: Server, roomId: string) {
    const accepted = round.addVote(vote)
    if (!accepted) return

    if (round.allPlayersVoted()) {
      const mainPlayer = round.getMainPlayer()
      io.to(roomId).emit("voting_result", mainPlayer)
      round.setState(new ChoosingNumberState())
    }
  }

  onScoreChoosed() {}
  onQuestion()     {}
  onAnswer()       {}
  onGuess()        {}
}