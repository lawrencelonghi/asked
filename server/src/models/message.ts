class Message {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    roomId: string;
    timestamp: Date;

    constructor(content: string, senderId: string, senderName: string, roomId: string) {
        this.id = this._generateId();
        this.content = content;
        this.senderId = senderId;
        this.senderName = senderName;
        this.roomId = roomId;
        this.timestamp = new Date();
    }

    _generateId(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const length = 14;
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}

export default Message;