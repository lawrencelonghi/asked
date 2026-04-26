import type Room from "../models/room.js";
import type Message from "../models/message.js"
import type { Player } from "../models/player.js";
import type { Vote } from "../models/vote.js";
import type { Round } from "../models/round.js";
import type { Question } from "../models/question.js";

export const roomList: Room[] = []
export const messageList: Message[] = []
export const playerList: Player[] = []
export const roundList: Round[] = []
export const voteList: Vote[] = []
export const questionList: Question[] = []
export const answerList: string[] = []