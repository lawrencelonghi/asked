'use client'
import { io, Socket} from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import EmojiPicker from 'emoji-picker-react';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Message, Player, Vote } from '../../../../types.js'
import Button from '@/components/Button';

export default function Game() {
  const searchParams = useSearchParams();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [ mySocketId, setMySocketId ] = useState(''); 
  const [ myPlayerName, setMyPlayerName]  = useState('');
  const [ newRoomId, setNewRoomId ] = useState('')
  const [ votedPlayer, setVotedPlayer ] = useState<Player | null>(null)
  const [ playerHasVoted, setPlayerHasVoted ] = useState(false)
  const [ mainPlayer, setMainPlayer ] = useState<Player | null>(null)
  const [ isVotingCompleted, setIsVotingCompleted ] = useState(false)
  const [ isPlayerReady, setIsPlayerReady ] = useState(false)
  const [ allPlayersReady, setAllPlayersReady ] = useState(false)

  
  const router = useRouter();


  useEffect(() => {
    // pega o nome dos query parameters
    const nameFromUrl = searchParams.get('playerName');
    if (nameFromUrl) {
      setMyPlayerName(nameFromUrl);
    }

    socketRef.current = io('http://localhost:3001')

    socketRef.current.on('connect', () => {
      const id = socketRef.current?.id || '';
      setMySocketId(id);

      const roomIdFromUrl = searchParams.get('roomId');

      if (roomIdFromUrl) {
        socketRef.current?.emit('join_room', { roomId: roomIdFromUrl });
      } else {
        socketRef.current?.emit('create_room');
      }
    });

    // só envia o nome depois de estar na sala
    socketRef.current.on('room_id', (data) => {
      setNewRoomId(data);
      if (nameFromUrl) {
        socketRef.current?.emit('send_player', { name: nameFromUrl });
      }
    });

    socketRef.current.on('room_id', (data) => {
      setNewRoomId(data);
    });

    socketRef.current.on('room_history',(data: Message[]) => {
      setMessages(data)
    })

    socketRef.current.on('room_error', (msg: string) => {
      alert(msg); // ou um estado de erro mais elegante
      router.push('/');
    });

    socketRef.current?.on('receive_message', (data: Message) => {
      setMessages(prev => [...prev, data])
    })

    socketRef.current.on('display_players', (data) => {      
      setPlayers(data)
    })

    socketRef.current.on('voting_result', (data) => {
      setMainPlayer(data)
    })

    socketRef.current.on('all_players_ready', (data: boolean) => {
      setAllPlayersReady(data)
    })

    return () => {
      if(socketRef.current){
        socketRef.current.disconnect()
      }
    }
  }, [searchParams])

  const onEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);


  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() && socketRef.current && myPlayerName) {
      const newMessage: Message = {
        senderSocketID: mySocketId,
        text: message,
        timestamp: Date.now(),
        senderName: myPlayerName
      };

      socketRef.current.emit("send_message", newMessage);
      setMessage('');
    }
  }

  function handleVotedPlayer(player: Player) {
    setVotedPlayer(player);
    const vote: Vote = {
      whoVoted: { socketId: mySocketId, name: myPlayerName },
      votedFor: player
    }
    socketRef.current?.emit("voted_player", vote );
    setPlayerHasVoted(true)
  }

  useEffect(() => {
    if(mainPlayer) {
      setIsVotingCompleted(true)
    }
  },[mainPlayer])

  function handleStartGame() {
    const playerReadyToPlay : Player = { 
      socketId: mySocketId, 
      name: myPlayerName 
    }
    socketRef.current?.emit('player_ready', playerReadyToPlay)
    setIsPlayerReady(true)
  }


  return (
    <div className="ml-8 mr-8 mt-12  flex justify-between">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl">ASKED</h1>

        <span>Room id: {newRoomId} </span>

        <div>
          <span>Players:</span>
        <ul>
          {players.map(p => (
            <div key={`${p.name}-${p.socketId}`} className='flex items-center'>
              <span className='mr-2 w-2 h-2 rounded-4xl bg-green-500'></span>
              <li className={p.socketId === mySocketId ? 'text-orange-500 font-semibold' : ''}>
                {p.name}
              </li>
            </div>
          ))}
        </ul>
        </div>
      </div>

      {/* GAME AREA */}

      {/* VOTING SECTION */}
      <div className='flex flex-col items-center gap-20 mt-20'>
        <h2 className='text-2xl font-semibold'>WHO SHOULD PLAY NOW?</h2>
        <ul className='grid grid-cols-3 gap-4'>
        {players.map(p => (
          <li key={p.name} 
            className={
              votedPlayer?.socketId === p.socketId
                ? 'border text-center bg-red-600 max-w-30 text-md px-4 py-2'
                : 'border text-center max-w-30 text-md px-4 py-2 hover:bg-white cursor-pointer hover:text-black'
            } 
            onClick={() => !playerHasVoted && handleVotedPlayer(p)}
          >
            {p.name}
          </li>
        ))}
        </ul>

        
        <span>SELECTED PLAYER: 
          <span className='text-red-600 text-3xl font-bold tracking-wide ml-2'>
            {mainPlayer?.name.toUpperCase()}
          </span>
        </span>
        
        {isVotingCompleted && (
          <Button text='START GAME' onClick={handleStartGame}/>

        )}

        {allPlayersReady && (
          <span className='text-red-600'>ALL ON BOARD</span>
        )}

      </div>

       {/* CHAT   */}
      <div className="w-[30vw] h-[80vh] border  flex flex-col justify-between relative">
        
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg) => (
            <div key={`${msg.senderSocketID}-${msg.timestamp}`} className="flex gap-4 mb-2">
              <span className={msg.senderSocketID === mySocketId ? 'font-semibold text-orange-500' : 'font-semibold'}>
                {msg.senderName}:
              </span>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 right-4 z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <form onSubmit={handleSendMessage} className="relative flex items-center border-t">
          <button 
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-3 ml-1 text-2xl hover:bg-gray-100 rounded transition-colors"
          >
            🫠
          </button>
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="type here . . ."
            className="w-full focus:outline-none focus:ring-0 p-2 pl-4" 
          />

          <button type="submit" className="mr-4 hover:opacity-70 transition-opacity">
            <Send className="cursor-pointer" />
          </button>
        </form>
      </div>
    </div>
  );
}