import { Round } from "../models/round.js"
import { Player } from "../models/player.js"
import { Question } from "../models/question.js"
import { answerList, questionList } from "../storage/storage.js"
import { Answer } from "../models/answer.js"

export class AnswerRepository {
  save(content: string, round: Round, answeredBy: Player, PlayerquestionAnswered: Question) {
    const answer = new Answer(content, round, answeredBy, PlayerquestionAnswered)
    answerList.push(answer)
  }

  findBySocketId(playerId: string) {
   const answer = answerList.filter( a => a.answeredBy.socketId === playerId)
  }

  findByRound(round: Round) {
    return answerList.filter(a => a.round === round)
  }

  findByQuestion(question: Question) {
  }
}