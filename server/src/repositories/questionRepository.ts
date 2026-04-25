import { Round } from "../models/round.js"
import { Player } from "../models/player.js"
import { Question } from "../models/question.js"
import { questionList } from "../storage/storage.js"

export class QuestionRepository {
  save(content: string, round: Round, askedTo: Player) {
    const question = new Question(content, round, askedTo)
    questionList.push(question)
  }

  findByRound(round: Round): Question[] {
    return questionList.filter(q => q.round === round)
  }
}