import type { Socket } from "socket.io";
import type Room from "../models/room.js";
import { roomList } from "../storage/storage.js";

export class RoomRepository {
    roomList: Room[]

    constructor() {
        this.roomList = roomList
    }

    findById(id: string): Room | null {
        this.roomList.forEach((room: Room) => {
            if(room.getId() == id) {
                return room
            }
        })

        return null
    }

    findBySocketId(socketId: string): Room | null {
        this.roomList.forEach((room: Room) => {
            if(room.getSocketId() == socketId) {
                return room
            }
        })

        return null
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