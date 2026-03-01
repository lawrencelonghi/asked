'use client'
import { io, Socket} from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import EmojiPicker from 'emoji-picker-react';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface Player {
  socketID: string;
  name: string;
}

interface Message {
  senderSocketID: string;
  text: string;
  timestamp: number;
  senderName: string;
}

export default function Game() {
  const searchParams = useSearchParams();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [mySocketId, setMySocketId] = useState(''); 
  const [myPlayerName, setMyPlayerName] = useState('');
  const [ newRoomId, setNewRoomId ] = useState('')
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

      if (nameFromUrl) {
        socketRef.current?.emit('send_player', { name: nameFromUrl });
      }
    });

    socketRef.current.on('room_id', (data) => {
      setNewRoomId(data);
    });

    socketRef.current.on('room_error', (msg: string) => {
      alert(msg); // ou um estado de erro mais elegante
      router.push('/');
    });

    socketRef.current?.on('receive_message', (data) => {
      setMessages(prev => [...prev, data])
    })

    socketRef.current.on('display_players', (data) => {
      setPlayers(data)
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

  useEffect(() => {
    console.log('Players atualizados:', players);
  }, [players]);

  useEffect(() => {
    console.log('Mensagens atualizadas:', messages);
  }, [messages]);

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

  return (
    <div className="ml-4 mr-4 flex justify-between">
      <div className="flex flex-col gap-10">
        <h1 className="mt-8 text-4xl">ASKED</h1>

        <span>Room id: {newRoomId} </span>

        <div>
          <span>Players:</span>
          <ul>
            {players.map(p =>(
              <div key={p.socketID} className='flex items-center'>
                <span className={p ? 'mr-2 w-2 h-2 rounded-4xl bg-green-500' : ''} ></span>
                <li>{p.name}</li>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-[50vw] h-[80vh] border mt-8 flex flex-col justify-between relative">
        
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg) => (
            <div key={msg.senderSocketID} className="flex gap-4 mb-2">
              <span className="font-semibold">{msg.senderName}:</span>
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