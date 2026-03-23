
export interface Player {
  socketId: string;
  name: string;
}

export interface Vote {
  whoVoted: Player
  votedFor: Player
}