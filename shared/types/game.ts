
export interface Player {
  socketId: string;
  name: string;
}

export interface Vote {
  whoVoted: Player
  votedFor: Player
}

export interface Message {
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
}