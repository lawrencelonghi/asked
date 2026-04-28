import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Socket } from 'socket.io-client'
import { Player } from '../../../shared/types/game'

export function useRoom(socket: Socket | null, playerName: string) {
  const router = useRouter()
  const [roomId, setRoomId] = useState('')
  const [roomCreator, setRoomCreator] = useState<Player | null>(null)
  const [isRoomCreator, setIsRoomCreator] = useState(false)

  useEffect(() => {
    if (!socket) return

    socket.on('room_id', (data: string) => {
      setRoomId(data)
      socket.emit('send_player', { name: playerName })
    })

    socket.on('room_creator', (creator: Player) => {
      setRoomCreator(creator)
      setIsRoomCreator(creator.socketId === socket.id)
    })

    socket.on('room_error', (msg: string) => {
      alert(msg)
      router.push('/')
    })

    return () => {
      socket.off('room_id')
      socket.off('room_creator')
      socket.off('room_error')
    }
  }, [socket, playerName, router])

  return { roomId, roomCreator, isRoomCreator }
}