
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

export interface Score {
  number: number | null;
  whoChoosed: Player | null
}

export interface QAItem {
  question: { content: string } | null
  answer: { content: string } | null
  askedTo: { name: string; socketId: string }
}