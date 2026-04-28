'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clipboard, ClipboardCheck } from 'lucide-react'
import { Player, Score, Vote } from '../../../../shared/types/game'
import Chat from '@/components/Chat'
import VotingSection from '@/components/VotingSection'
import GameSection from '@/components/GameSection'
import ChooseScore from '@/components/ChosseScore'
import Lobby from '@/components/Lobby'
import { mainPlayerContext } from '@/contexts/mainPlayerContext'
import { roomCreatorContext } from '@/contexts/roomCreatorContext'
import { useSocket } from '@/hooks/useSocket'
import { useRoom } from '@/hooks/useRoom'
import { useGameState } from '@/hooks/useGameState'
import { useClipboard } from '@/hooks/useClipboard'

export default function Game() {
  const searchParams = useSearchParams()
  const playerName = searchParams.get('playerName') ?? ''

  // socket
  const { socketRef, mySocketId } = useSocket()

  // join/create room on socket connect
  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    socket.on('connect', () => {
      const roomId = searchParams.get('roomId')?.trim()
      if (roomId) {
        socket.emit('join_room', { roomId, name: playerName })
      } else {
        socket.emit('create_room', { name: playerName })
      }
    })

    return () => { socket.off('connect') }
  }, [socketRef, searchParams, playerName])

  // hooks
  const { roomId, roomCreator, isRoomCreator } = useRoom(socketRef.current, playerName)
  const {
    messages, players, mainPlayer, allPlayersReady,
    roundScore, isRoundStarted, questionsStarted,
    mainPlayerQuestion, nextPlayerThatAnswers,
  } = useGameState(socketRef.current)
  const clipboard = useClipboard()
  const [votedPlayer, setVotedPlayer] = useState<Player | null>(null)
  const [playerHasVoted, setPlayerHasVoted] = useState(false)
  const [isVotingCompleted, setIsVotingCompleted] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [choosedNumber, setChoosedNumber] = useState<number | null>(null)
  const [isChoosingComplete, setIsChoosingCompleted] = useState(false)
  const [questionInput, setQuestionInput] = useState('')
  const [answerInput, setAnswerInput] = useState('')
  const [playerAnswer, setPlayerAnswer] = useState('')

  const isMainPlayer = mainPlayer?.socketId === mySocketId

  useEffect(() => { if (mainPlayer) setIsVotingCompleted(true) }, [mainPlayer])
  useEffect(() => { if (roundScore) setIsChoosingCompleted(true) }, [roundScore])

  // handlers
  function handleVotedPlayer(player: Player) {
    setVotedPlayer(player)
    const vote: Vote = {
      whoVoted: { socketId: mySocketId, name: playerName },
      votedFor: player,
    }
    socketRef.current?.emit('voted_player', vote)
    setPlayerHasVoted(true)
  }

  function handleGetReady() {
    socketRef.current?.emit('player_ready', { socketId: mySocketId, name: playerName })
    setIsPlayerReady(true)
  }

  function handleChoosedNumber(number: number) {
    setChoosedNumber(number)
    const score: Score = {
      number,
      whoChoosed: { socketId: mySocketId, name: playerName },
    }
    socketRef.current?.emit('score_choosed', score)
  }

  function handleStartRound() {
    socketRef.current?.emit('start_round', isRoundStarted)
  }

  function handleMainPlayerQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (isMainPlayer && questionInput.trim()) {
      socketRef.current?.emit('mainPlayer_question', questionInput)
      setQuestionInput('')
    }
  }

  function handlePlayerAnswer(e: React.FormEvent) {
    e.preventDefault()
    if (!isMainPlayer && answerInput.trim()) {
      socketRef.current?.emit('player_answer', answerInput)
      setPlayerAnswer(answerInput)
      setAnswerInput('')
    }
  }

  return (
    <roomCreatorContext.Provider value={roomCreator}>
      <div className="ml-8 mr-8 mt-12 flex justify-between">

        {/* sidebar */}
        <div className="flex flex-col gap-10">
          <h1 className="text-4xl">ASKED</h1>

          <div
            className="flex items-center gap-2 cursor-pointer select-none w-fit"
            onClick={() => clipboard.copy(roomId)}
            onMouseEnter={() => clipboard.setHovered(true)}
            onMouseLeave={() => clipboard.setHovered(false)}
          >
            <span>Room id: {roomId}</span>
            {clipboard.hovered && (
              clipboard.copied
                ? <ClipboardCheck size={16} className="text-green-500" />
                : <Clipboard size={16} />
            )}
          </div>

          {isRoomCreator && <span>You are the room creator.</span>}

          <div>
            <span>Players:</span>
            <ul>
              {players.map(p => (
                <div key={`${p.name}-${p.socketId}`} className="flex items-center">
                  <span className="mr-2 w-2 h-2 rounded-4xl bg-green-500" />
                  <li className={p.socketId === mySocketId ? 'text-orange-500 font-semibold' : ''}>
                    {p.name}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        {/* lobby */}
        {!isRoundStarted && (
          <Lobby
            players={players}
            roomCreator={roomCreator}
            isCreator={isRoomCreator}
            mySocketId={mySocketId}
            onStartRound={handleStartRound}
          />
        )}

        {/* voting */}
        {isRoundStarted && !allPlayersReady && !questionsStarted && (
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
          {/* choose a number */}
          {isRoundStarted && allPlayersReady && !questionsStarted && (
            <ChooseScore
              choosedNumber={choosedNumber}
              isChoosingComplete={isChoosingComplete}
              onChoose={handleChoosedNumber}
              roundScore={roundScore}
              mySocketId={mySocketId}
            />
          )}

          {/* questions / answers */}
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

          {/* chat */}
          {!(isMainPlayer && allPlayersReady && !questionsStarted) && (
            <Chat
              socket={socketRef.current}
              messages={messages}
              mySocketId={mySocketId}
              myPlayerName={playerName}
            />
          )}
        </mainPlayerContext.Provider>

      </div>
    </roomCreatorContext.Provider>
  )
}