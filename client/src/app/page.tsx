'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

type View = 'name' | 'menu' | 'join'

export default function Home() {
  const router = useRouter()
  const [view, setView] = useState<View>('name')
  const [nameInput, setNameInput] = useState('')
  const [savedName, setSavedName] = useState('')
  const [roomInput, setRoomInput] = useState('')

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (nameInput.trim()) {
      setSavedName(nameInput.trim())
      setNameInput('')
      setView('menu')
    }
  }

  function handleCreateRoom() {
    router.push(`/game?playerName=${encodeURIComponent(savedName)}`)
  }

  function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault()
    if (roomInput.trim()) {
      router.push(
        `/game?playerName=${encodeURIComponent(savedName)}&roomId=${encodeURIComponent(roomInput)}`
      )
    }
  }

  return (
    <div className="flex flex-col gap-18 items-center">
      <h1 className="mt-18 text-6xl">ASKED</h1>

      {view === 'name' && (
        <form onSubmit={handleNameSubmit} className="flex flex-col gap-6 items-center">
          <label htmlFor="playerName" className="text-2xl">Type your name:</label>
          <input
            id="playerName"
            type="text"
            className="border-b text-xl text-center focus:outline-none"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
          <Button text="ENTER" />
        </form>
      )}

      {view === 'menu' && (
        <div className="flex flex-col items-center gap-10">
          <h2 className="text-2xl">Hello, {savedName}!</h2>
          <div className="flex flex-col gap-4 items-center">
            <Button text="CREATE ROOM" onClick={handleCreateRoom} />
            <span>or</span>
            <Button text="JOIN ROOM" onClick={() => setView('join')} />
          </div>
        </div>
      )}

      {view === 'join' && (
        <form onSubmit={handleJoinRoom} className="flex flex-col gap-6 items-center">
          <input
            type="text"
            placeholder="Room ID"
            className="border-b text-xl text-center focus:outline-none"
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
          />
          <Button text="ENTER" />
        </form>
      )}
    </div>
  )
}