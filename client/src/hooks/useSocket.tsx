import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

interface UseSocketOptions {
  playerName: string
  roomIdFromUrl?: string
}

export function useSocket({ playerName, roomIdFromUrl }: UseSocketOptions) {
  const socketRef = useRef<ReturnType<typeof io> | null>(null)
  const [mySocketId, setMySocketId] = useState('')
  const [roomId, setRoomId] = useState('')

  useEffect(() => {
    const socket = io('http://localhost:3001')
    socketRef.current = socket

    // tudo registrado antes do connect disparar
    socket.on('connect', () => {
      setMySocketId(socket.id ?? '')

      if (roomIdFromUrl) {
        socket.emit('join_room', { roomId: roomIdFromUrl, name: playerName })
      } else {
        socket.emit('create_room', { name: playerName })
      }
    })

    socket.on('room_id', (id: string) => {
      setRoomId(id)
    })

    return () => {
      socket.disconnect()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // playerName e roomIdFromUrl são lidos uma única vez na conexão inicial,
  // intencionalmente sem re-executar o efeito

  return { socketRef, mySocketId, roomId }
}