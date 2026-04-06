export class Player {
    name: string;
    socketId: string;

    constructor(name: string, socketId: string) {
        this.name = name;
        this.socketId = socketId;
    }
}