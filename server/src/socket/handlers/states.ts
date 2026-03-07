export const players: Array<{ id: number; name: string; socketId: string }> = []

//map de mensagens por sal
export const roomMessagesMap = new Map<
  string,
  Array<{
    senderSocketID: string
    text: string
    timestamp: number
    senderName: string
  }>
>()

export const socketRoomMap = new Map<string, string>()