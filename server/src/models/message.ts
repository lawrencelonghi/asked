class Message {
    id: number;
    content: string;
    senderId: number;
    timestamp: Date;

    constructor(id: number, content: string, senderId: number, timestamp: Date) {
        this.id = id;
        this.content = content;
        this.senderId = senderId;
        this.timestamp = timestamp;
    }
}

export default Message;