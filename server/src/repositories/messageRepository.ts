import type Message from "../models/message.js";
import { messageList } from "../storage/storage.js";

export class MessageRepository {
    messageList: Message[]

    constructor() {
        this.messageList = messageList;
    }

    findById(id: string): Message | null {
        return this.messageList.find(message => message.id === id) ?? null;
    }

    findBySender(senderId: string): Message[] {
        return this.messageList.filter(message => message.senderId === senderId);
    }

    save(message: Message) {
      const index = this.messageList.findIndex(m => m.id === message.id)

      if(index !== -1) {
        this.messageList[index] = message
      } else {
        this.messageList.push(message)
      }
      return this
    }

    deleteByRoomId(roomId: string): MessageRepository {
      this.messageList = this.messageList.filter(message => message.roomId !== roomId);
      return this;
    }
}