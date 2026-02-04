'use client'

import Image from "next/image";
import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Send } from 'lucide-react';

interface Player {
  id: number;
  name: string;
}

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [savedPlayer, setSavedPlayer] = useState<Player | null>(null);

  function handlePlayerName(e: React.FormEvent) {
    e.preventDefault();
    if (playerName.trim()) {
      const newPlayer: Player = {
        id: Date.now(),
        name: playerName
      };
      
      setSavedPlayer(newPlayer);
      setPlayerName('');
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

        <button className="border text-sm w-fit px-4 py-2 hover:bg-white  cursor-pointer hover:text-black">ENTER</button>
      </form>
    </div>
    }


    {savedPlayer && 
    <div className="flex flex-col items-center gap-10">
      <h2 className="text-2xl">Hello, {savedPlayer.name}!</h2>

        <div className="flex flex-col gap-4 items-center">
          <button className="border text-sm w-fit px-4 py-2 hover:bg-white  cursor-pointer hover:text-black">
            CREATE A ROOM 
          </button>  
          <span>or</span>
          <button className="border text-sm w-fit px-4 py-2 hover:bg-white  cursor-pointer hover:text-black">
            JOIN A ROOM 
          </button>  
        </div>  
    </div>
    }

   </div>
  );
}