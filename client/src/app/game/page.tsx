'use client'
import { io, Socket} from 'socket.io-client';
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Message, Player, Score, Vote } from '../../../../shared/types/game'
import Chat from '@/components/Chat';
import VotingSection from '@/components/VotingSection';
import GameSection from '@/components/GameSection';
import ChooseNumber from '@/components/ChooseNumber';
import { mainPlayerContext } from '@/contexts/mainPlayerContext';
import { roomCreatorContext } from '@/contexts/roomCreatorContext';
import WaitingPlayers from '@/components/WaitingPlayers';



export default function Game() {
  const searchParams = useSearchParams();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [mySocketId, setMySocketId] = useState('');
  const [myPlayerName, setMyPlayerName] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [votedPlayer, setVotedPlayer] = useState<Player | null>(null);
  const [playerHasVoted, setPlayerHasVoted] = useState(false);
  const [mainPlayer, setMainPlayer] = useState<Player | null>(null);
  const [isVotingCompleted, setIsVotingCompleted] = useState(false);
  const [ isPlayerReady, setIsPlayerReady ] = useState(false);
  const [ allPlayersReady, setAllPlayersReady ] = useState(false);
  const [ choosedNumber, setChoosedNumber ] = useState<number | null>(null)
  const [ isChoosingComplete, setIsChoosingCompleted ] = useState(false)
  const [ finalScore, setFinalScore ] = useState<number | null>(null)
  const isMainPlayer = mainPlayer?.socketId === mySocketId;
  const [ isRoomCreator, setIsRoomCreator ] = useState(false);
  const [ roomCreator, setRoomCreator ] = useState<Player | null> (null)
  const [ isRoundStarted, setIsRoundStarted ] = useState(false)


  const router = useRouter();

  useEffect(() => {
    const nameFromUrl = searchParams.get('playerName');
    if (nameFromUrl) setMyPlayerName(nameFromUrl);

    socketRef.current = io('http://localhost:3001');

    // MAIN SOCKET EVENTS
    socketRef.current.on('connect', () => {
      const id = socketRef.current?.id || '';
      setMySocketId(id);

      const roomIdFromUrl = searchParams.get('roomId');
      if (roomIdFromUrl) {
        socketRef.current?.emit('join_room', { roomId: roomIdFromUrl, name: nameFromUrl });
      } else {
        socketRef.current?.emit('create_room', {name: nameFromUrl});
      }
    });

    socketRef.current.on('room_id', (data) => {
      setNewRoomId(data);
      
      if (nameFromUrl) {
        socketRef.current?.emit('send_player', { name: nameFromUrl });
      }
    });

    socketRef.current.on('room_history', (data: Message[]) => {
      setMessages(data);
    });

    socketRef.current.on('room_error', (msg: string) => {
      alert(msg);
      router.push('/');
    });

    socketRef.current.on('receive_message', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });

    socketRef.current.on('display_players', (data) => {
      setPlayers(data);
    });

    socketRef.current.on('voting_result', (data) => {
      setMainPlayer(data);
    });

    socketRef.current.on('all_players_ready', (data: boolean) => {
      setAllPlayersReady(data);
    });

    socketRef.current.on('final_score', (data: number) => {
      setFinalScore(data)
    })

    socketRef.current.on('room_creator', (creator: Player) => {
     setRoomCreator(creator)
     setIsRoomCreator(creator.socketId === socketRef.current?.id)
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [searchParams]);

  //OTHER FUNCTIONS

  useEffect(() => {
    if (mainPlayer) setIsVotingCompleted(true);
  }, [mainPlayer]);

  useEffect(() => {
    if (finalScore) setIsChoosingCompleted(true)
  }, [finalScore]);

  function handleVotedPlayer(player: Player) {
    setVotedPlayer(player);
    const vote: Vote = {
      whoVoted: { socketId: mySocketId, name: myPlayerName },
      votedFor: player,
    };
    socketRef.current?.emit('voted_player', vote);
    setPlayerHasVoted(true);
  }

  function handleGetReady() {
    const playerReadyToPlay: Player = { socketId: mySocketId, name: myPlayerName };
    socketRef.current?.emit('player_ready', playerReadyToPlay);
    setIsPlayerReady(true);
  }

  function handleChoosedNumber(number: number) {
    setChoosedNumber(number)
    const score: Score = {
      number: number,
      whoChoosed: {socketId: mySocketId, name: myPlayerName}
    }
    console.log(score);
    
    socketRef.current?.emit("score_choosed", score)
  }

  return (

    // MAIN STRUCTURE
    <roomCreatorContext.Provider value={roomCreator}>
    <div className="ml-8 mr-8 mt-12 flex justify-between">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl">ASKED</h1>
        <span>Room id: {newRoomId}</span>
        {isRoomCreator && (
          <span>You are the room creator.</span>
        )}
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

      

       {!isRoundStarted && (
        <WaitingPlayers players={players} roomCreator={roomCreator} isCreator={isRoomCreator} />
       )}

      {/* MAIN GAME SECTION */}
      {!allPlayersReady || isRoundStarted && (
      // VOTING PART
      <VotingSection
        players={players}
        votedPlayer={votedPlayer}
        playerHasVoted={playerHasVoted}
        mainPlayer={mainPlayer}
        isVotingCompleted={isVotingCompleted}
        onVote={handleVotedPlayer}
        onGetReady={handleGetReady}
      />
      )}

      <mainPlayerContext.Provider value={mainPlayer}>
      {allPlayersReady || isRoundStarted && (
        // CHOOSE A NUMBER SECTION
        <ChooseNumber
          choosedNumber={choosedNumber}
          isChoosingComplete={isChoosingComplete}
          onChoose={handleChoosedNumber}
          finalScore={finalScore}
          mySocketId={mySocketId}
        />
      )}

      {/* CHAT SECTION */}
      {(!allPlayersReady || !isMainPlayer || isChoosingComplete) && (
        <Chat
          socket={socketRef.current}
          messages={messages}
          mySocketId={mySocketId}
          myPlayerName={myPlayerName}
        />
      )}


      </mainPlayerContext.Provider>

    </div>
  </roomCreatorContext.Provider>
  );
}