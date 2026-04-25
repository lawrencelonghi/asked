// Chat.tsx
'use client'
import type { Socket } from 'socket.io-client';
import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Send } from 'lucide-react';
import type { Message } from '../../../shared/types/game'

interface ChatProps {
  socket: Socket | null;
  messages: Message[];
  mySocketId: string;
  myPlayerName: string;
}

const Chat = ({ socket, messages, mySocketId, myPlayerName }: ChatProps) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  function onEmojiClick(emojiObject: any) {
    setMessage(prev => prev + emojiObject.emoji);
  }

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() && socket && myPlayerName) {
      const newMessage: Message = {
        senderId: mySocketId,
        content: message,
        timestamp: new Date(),
        senderName: myPlayerName
      };
      socket.emit("send_message", newMessage);
      setMessage('');
    }
  }

  return (
    <div className="w-[30vw] h-[80vh] border flex flex-col justify-between relative">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((msg) => (
          <div key={`${msg.senderId}-${msg.timestamp}`} className="flex gap-4 mb-2">
            <span className={msg.senderId === mySocketId ? 'font-semibold text-orange-500' : 'font-semibold'}>
              {msg.senderName}:
            </span>
            <p>{msg.content}</p>
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
          <Send className="cursor-pointer"
          color='#2b9c41' />
        </button>
      </form>
    </div>
  );
}

export default Chat;