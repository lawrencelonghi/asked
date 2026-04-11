'use client'

import { useState, useRef, useEffect } from 'react';
import { io, Socket} from 'socket.io-client';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface Player {
  id: number;
  name: string;
}

export default function Home() {
  const [ playerName, setPlayerName ] = useState('');
  const [ savedPlayer, setSavedPlayer ] = useState<Player | null>(null);
  const [ isJoinRoomClicked, setIsJoinRoomClicked ] = useState(false)
  const [ userTypedRoom, setUserTypedRoom ] = useState('')
  const router = useRouter();


  

  function handlePlayerName(e: React.FormEvent) {
    e.preventDefault();
    if (playerName.trim()) {
      setSavedPlayer({ id: Date.now(), name: playerName });
      setPlayerName('');
    }
  }

  function handleCreateRoom() {
    if (savedPlayer) {
      router.push(`/game?playerName=${encodeURIComponent(savedPlayer.name)}`);
    }
  }

  function handleButtonJoinRoom() {
    setIsJoinRoomClicked(true)
  }

  function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (savedPlayer && userTypedRoom.trim()) {
      router.push(`/game?playerName=${encodeURIComponent(savedPlayer.name)}&roomId=${encodeURIComponent(userTypedRoom)}`);
    }
  }


  return (
   <div className="flex flex-col gap-18 items-center">
    <h1 className="mt-18 text-6xl">ASKED</h1>

    {!savedPlayer && 
      <div className="flex flex-col">
        <form onSubmit={handlePlayerName} className="flex flex-col gap-6 items-center">
          <label htmlFor="playerName" className=" text-2xl">Type Your name: </label>

          <input type="text" 
                className="border-b text-xl text-center focus:outline-none" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}/>

     <Button text='ENTER'/>
        </form>
      </div>
    }

    {savedPlayer && !isJoinRoomClicked &&
    
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-2xl">Hello, {savedPlayer.name}!</h2>

        <div className="flex flex-col gap-4 items-center">
          <Button text='CREATE ROOM' onClick={handleCreateRoom}/>          
          <span>or</span>
          <Button text='JOIN ROOM' onClick={handleButtonJoinRoom}/>

        </div>  
    </div>
    }

    {isJoinRoomClicked &&
      <form onSubmit={handleJoinRoom}>
        <input type="text" 
                placeholder='Room ID' 
                className='border-b text-xl text-center focus:outline-none'
                onChange={(e) => setUserTypedRoom(e.target.value)}
          />

            <Button text='ENTER'/>
      
      </form>
      }

   </div>
  );
}