import { Vote } from "../../models/vote.js"
import type {Player} from "../../models/player.js"
import type Message from "../../models/message.js"

export const players: Player[] = []

//map de mensagens por sala
export const roomMessagesMap = new Map<string, Message[]>()

export const socketRoomMap = new Map<string, string>()

export const votingList = new Map<string, Vote[]>()

export const playersThatAreReady = new Map<string, Player[]>()


