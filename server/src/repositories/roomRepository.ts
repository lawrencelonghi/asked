import type Room from "../models/room.js";
import { roomList } from "../storage/storage.js";

export class RoomRepository {
    roomList: Room[]

    constructor() {
        this.roomList = roomList
    }

    //pega o room pelo id do proprio room
    findById(id: string): Room | null {
        return this.roomList.find(room => room.getId() === id) ?? null
    }

    //pega o room atraves do id da conexão algum player
    findBySocketId(socketId: string): Room | null {
        return this.roomList.find(room => room.hasPlayer(socketId)) ?? null
    }
    
    save(room: Room): RoomRepository {
        const index = this.roomList.findIndex(r => r.getId() === room.getId());
        if (index !== -1) {
            this.roomList[index] = room;
        } else {
            this.roomList.push(room);
        }

        return this
    }

    delete(room: Room): RoomRepository {
        const index = this.roomList.findIndex(r => r.getId() === room.getId());
        if (index !== -1) {
            this.roomList.splice(index, 1);
        }

        return this
    }

    deleteBySocketId(socketId: string): RoomRepository {
        const index = this.roomList.findIndex(r => r.getSocketId() === socketId);
        if (index !== -1) {
            this.roomList.splice(index, 1);
        }

        return this
    }
}