import {Server, Socket} from 'socket.io'

export abstract class ConnectionListener {
    constructor(protected io: Server, protected socket: Socket) {
    }

    abstract listen(): void
}