import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const [mySocketId, setMySocketId] = useState('')

  useEffect(() => {
    const socket = io('http://localhost:3001')
    socketRef.current = socket

    socket.on('connect', () => {
      setMySocketId(socket.id ?? '')
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return { socketRef, mySocketId }
}