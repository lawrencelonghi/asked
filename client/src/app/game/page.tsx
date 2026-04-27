'use client'
import { io, Socket} from 'socket.io-client';
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Clipboard, ClipboardCheck } from 'lucide-react';
import { Message, Player, Score, Vote } from '../../../../shared/types/game'
import Chat from '@/components/Chat';
import VotingSection from '@/components/VotingSection';
import GameSection from '@/components/GameSection';
import ChooseScore from '@/components/ChosseScore';
import { mainPlayerContext } from '@/contexts/mainPlayerContext';
import { roomCreatorContext } from '@/contexts/roomCreatorContext';
import Lobby from '@/components/Lobby';



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
  const [ isRoundScoreChoosen, setIsRoundScoreChoosen ] = useState(false)
  const [ roundScore, setRoundScore ] = useState<number | null>(null)
  const isMainPlayer = mainPlayer?.socketId === mySocketId;
  const [ isRoomCreator, setIsRoomCreator ] = useState(false);
  const [ roomCreator, setRoomCreator ] = useState<Player | null> (null)
  const [ isRoundStarted, setIsRoundStarted ] = useState(false)
  const [ questionsStarted, setQuestionsStarted] = useState(false)
  const [ mainPlayerQuestion, setMainPlayerQuestion] = useState('')
  const [questionInput, setQuestionInput] = useState('')           
  const [ playerHasAnswered, setPlayerHasAnswered] = useState(false)
  const [ nextPlayerThatAnswers, setNextPlayerThatAnswers ] = useState<Player | null> (null)
  const [ roomIdCopied, setRoomIdCopied ] = useState(false)
  const [ isClipboardHovered, setIsClipboardHovered ] = useState(false)
  const [ playerAnswer, setPlayerAnswer ] = useState('')
  const [ answerInput, setAnswerInput ] = useState('')
  


  const router = useRouter();

  useEffect(() => {
    const nameFromUrl = searchParams.get('playerName');
    if (nameFromUrl) setMyPlayerName(nameFromUrl);

    socketRef.current = io('http://localhost:3001');

    // MAIN SOCKET EVENTS
    socketRef.current.on('connect', () => {
      const id = socketRef.current?.id || '';
      setMySocketId(id);

      const roomIdFromUrl = searchParams.get('roomId')?.trim();
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

    socketRef.current.on('round_score', (score: number) => {
      setRoundScore(score)
    })

    socketRef.current.on('questions_started', (data) => {
      setQuestionsStarted(data)
      setMessages([])
    })

    socketRef.current.on('room_creator', (creator: Player) => {
     setRoomCreator(creator)
     setIsRoomCreator(creator.socketId === socketRef.current?.id)
    });

    socketRef.current.on('round_started', (data) => {
      setIsRoundStarted(data)
      console.log('round comecoooou');
      
    })

    socketRef.current.on('main_player_question', (question) => {
      setMainPlayerQuestion(question)
    })

    socketRef.current.on('next_player_to_answer', (player) => {     
      setNextPlayerThatAnswers(player)
      console.log('next player to answer is:', player);
      
    })

    return () => {
      socketRef.current?.disconnect();
    };
  }, [searchParams]);

  //OTHER FUNCTIONS

  useEffect(() => {
    if (mainPlayer) setIsVotingCompleted(true);
  }, [mainPlayer]);

  useEffect(() => {
    if (roundScore) setIsChoosingCompleted(true)
  }, [roundScore]);

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

  function handleStartRound() {
    socketRef.current?.emit('start_round', isRoundStarted)
  }

  //questions section
  function handleMainPlayerQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (isMainPlayer && questionInput.trim()) {
      socketRef.current?.emit('mainPlayer_question', questionInput)
      setMainPlayerQuestion(questionInput)
      setQuestionInput('')  // ← limpa o input imediatamente
    }
  }

  //answer section
  function handlePlayerAnswer(e: React.FormEvent) {
    e.preventDefault()
    if(!isMainPlayer && answerInput.trim()) {
      socketRef.current?.emit('player_answer', answerInput)
      setPlayerAnswer(answerInput)
      setAnswerInput('')
    }
  }

  //funcao de clipboard para o roomId
  async function handleCopy() {
    await navigator.clipboard.writeText(newRoomId)
    setRoomIdCopied(true)
  }

  function displayClipboard() {
    setIsClipboardHovered(true)
  }

  return (

    // MAIN STRUCTURE
    <roomCreatorContext.Provider value={roomCreator}>
    <div className="ml-8 mr-8 mt-12 flex justify-between">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl">ASKED</h1>
      <div
        className="flex items-center gap-2 cursor-pointer select-none w-fit"
        onClick={handleCopy}
        onMouseEnter={() => setIsClipboardHovered(true)}
        onMouseLeave={() => setIsClipboardHovered(false)}
      >
        <span>Room id: {newRoomId}</span>
        {isClipboardHovered && (
          roomIdCopied
            ? <ClipboardCheck size={16} className="text-green-500" />
            : <Clipboard size={16} />
        )}
      </div>
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
        <Lobby
          players={players}
          roomCreator={roomCreator} 
          isCreator={isRoomCreator} 
          mySocketId={mySocketId}
          onStartRound={handleStartRound}
        />
       )}

      {/* MAIN GAME SECTION */}
      {isRoundStarted && !allPlayersReady && !questionsStarted && (
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
      {isRoundStarted && allPlayersReady && !questionsStarted && (
        // CHOOSE A NUMBER SECTION
        <ChooseScore
          choosedNumber={choosedNumber}
          isChoosingComplete={isChoosingComplete}
          onChoose={handleChoosedNumber}
          roundScore={roundScore}
          mySocketId={mySocketId}
        />
      )}

      {isRoundStarted && questionsStarted && (
        <GameSection  
          players={players}
          mainPlayer={mainPlayer}
          roundScore={roundScore}
          mySocketId={mySocketId}
          mainPlayerQuestion={mainPlayerQuestion}
          questionInput={questionInput}
          onQuestionChange={setQuestionInput}
          nextPlayerThatAnswers={nextPlayerThatAnswers}
          handleMainPlayerQuestion={handleMainPlayerQuestion}
          playerAnswer={playerAnswer}
          handlePlayerAnswer={handlePlayerAnswer}
          onAnswerChange={setAnswerInput}
          answerInput={answerInput}
    
        />
      )}

      {/* CHAT SECTION */}
      {!(isMainPlayer && allPlayersReady && !questionsStarted) && (
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