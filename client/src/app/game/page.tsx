'use client'
import { io, Socket} from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Send } from 'lucide-react';

interface Player {
  id: number;
  name: string;
}

interface Message {
  id: number;
  text: string;
  timestamp: number;
  senderId: string
}


export default function Home() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null)
  const [mySocketId, setMySocketId] = useState(''); 


  useEffect(() => {
    socketRef.current = io('http://localhost:3001')

    socketRef.current.on('connect', () => {
      const id = socketRef.current?.id || '';
      setMySocketId(id);
      console.log('Meu socket ID:', id);
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
  },[])

    function sendMessage() {
    if (socketRef.current) {
      socketRef.current.emit("send_message", message);
    }
  }

  const onEmojiClick = (emojiObject: any) => {
    setMessage(prev => prev + emojiObject.emoji);
  };

  // Fechar quando clicar fora
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

  // Log atualizado da lista de players
  useEffect(() => {
    console.log('Players atualizados:', players);
  }, [players]);

  // Log atualizado das mensagens
  useEffect(() => {
    console.log('Mensagens atualizadas:', messages);
  }, [messages]);

  function handlePlayerName(e: React.FormEvent) {
    e.preventDefault();
    if (playerName.trim() && socketRef.current) {
      const newPlayer: Player = {
        id: Date.now(),
        name: playerName
      };
      
      socketRef.current.emit('send_player', newPlayer)
      setPlayerName('');
    }
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        timestamp: Date.now(),
        senderId: mySocketId
      };

      socketRef.current.emit("send_message", newMessage);
      setMessage(''); // Limpa o input
    }
  }

  return (
    <div className="ml-4 mr-4 flex justify-between">
      <div className="flex flex-col gap-10">
        <h1 className="mt-8 text-4xl">ASKED</h1>

        <form onSubmit={handlePlayerName} className="flex gap-2">
          <label htmlFor="playerName">Type your name:</label>
          <input 
            type="text" 
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border-b focus:outline-none"
          />
          <button type="submit" className="px-3 py-1 text-sm text-white border hover:text-black hover:bg-white hover:border-black">
            enter
          </button>
        </form>

        {/* Lista de jogadores */}
        {players.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Players:</h3>
            <ul className="list-disc pl-5">
              {players.map((player) => (
                <li key={player.id}>
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-[50vw] h-[80vh] border mt-8 flex flex-col justify-between relative">
        
        {/* Área de mensagens */}
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 mb-2">
              <span>{msg.senderId}:</span>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 right-4 z-10">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        {/* Input com ícone */}
        <form onSubmit={handleSendMessage} className="relative flex items-center border-t">
          {/* Ícone de emoji */}
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