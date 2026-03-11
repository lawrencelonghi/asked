import React from 'react'

const page = () => {
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
          <Button text='START GAME' onClick={handleGetReady}/>

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

export default page