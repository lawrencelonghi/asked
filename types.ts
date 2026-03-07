export interface Player {
  socketId: string;
  name: string;
}

export interface Message {
  senderSocketID: string;
  text: string;
  timestamp: number;
  senderName: string;
}

export interface Vote {
  whoVoted: Player
  votedFor: Player
}