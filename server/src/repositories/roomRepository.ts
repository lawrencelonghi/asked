import type Room from "../models/room.js";
import prisma from "../lib/prisma.js";

export class RoomRepository {

  async findById(id: string): Promise<Room | null> {
    return await prisma.room.findUnique({ where: { id } })
  }

  async findBySocketId(socketId: string): Promise<Room | null> {
    return await prisma.room.findFirst({ where: { socketId } })
  }

  async save(room: Room): Promise<void> {
    await prisma.room.upsert({
      where: { id: room.getId() },
      update: {},
      create: {
        id: room.getId(),
        socketId: room.getSocketId(),
      }
    })
  }

  async delete(room: Room): Promise<void> {
    await prisma.room.delete({ where: { id: room.getId() } })
  }

  async deleteBySocketId(socketId: string): Promise<void> {
    await prisma.room.deleteMany({ where: { socketId } })
  }
}