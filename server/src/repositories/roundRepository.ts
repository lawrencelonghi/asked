import { roundList } from "../storage/storage.js";
import { roomList } from "../storage/storage.js";
import { Round } from "../models/round.js";
import Room from "../models/room.js";

export class RoundRepository {
  roundList: Round[]

  constructor() {
    this.roundList = roundList
  }

  //feito com ia 

  findActiveByRoom(room: Room): Round | undefined {
    // Pega o último round criado para a sala (o ativo)
    const roomRounds = this.roundList.filter(r => r.getRoom().getId() === room.getId())
    return roomRounds[roomRounds.length - 1]
  }

  save(round: Round) {
    const index = this.roundList.findIndex(r => r.getId() === round.getId())
    if (index !== -1) {
      this.roundList[index] = round // atualiza se já existe
    } else {
      this.roundList.push(round)   // insere se é novo
    }
  }

  deleteByRoom(room: Room) {
    // Limpa rounds da sala ao fim de todos os rounds
    const index = this.roundList.findIndex(r => r.getRoom().getId() === room.getId())
    if (index !== -1) this.roundList.splice(index, 1)
  }
}