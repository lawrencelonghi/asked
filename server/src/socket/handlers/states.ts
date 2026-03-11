import { type Player, type Message, type Vote } from "../../../../types.js"

export const players: Player[] = []

//map de mensagens por sala
export const roomMessagesMap = new Map<string, Message[]>()

export const socketRoomMap = new Map<string, string>()

export const votingList = new Map<string, Vote[]>()

export const playersThatAreReady = new Map<string, Player[]>()


