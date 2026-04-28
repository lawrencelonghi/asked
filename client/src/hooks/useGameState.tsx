import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Message, Player } from '../../../shared/types/game'

export function useGameState(socket: Socket | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [mainPlayer, setMainPlayer] = useState<Player | null>(null)
  const [allPlayersReady, setAllPlayersReady] = useState(false)
  const [roundScore, setRoundScore] = useState<number | null>(null)
  const [isRoundStarted, setIsRoundStarted] = useState(false)
  const [questionsStarted, setQuestionsStarted] = useState(false)
  const [mainPlayerQuestion, setMainPlayerQuestion] = useState('')
  const [nextPlayerThatAnswers, setNextPlayerThatAnswers] = useState<Player | null>(null)

  useEffect(() => {
    if (!socket) return

    socket.on('room_history', (data: Message[]) => setMessages(data))
    socket.on('receive_message', (data: Message) => setMessages(prev => [...prev, data]))
    socket.on('display_players', (data: Player[]) => setPlayers(data))
    socket.on('voting_result', (data: Player) => setMainPlayer(data))
    socket.on('all_players_ready', (data: boolean) => setAllPlayersReady(data))
    socket.on('round_score', (score: number) => setRoundScore(score))
    socket.on('round_started', (data: boolean) => setIsRoundStarted(data))
    socket.on('questions_started', (data: boolean) => {
      setQuestionsStarted(data)
      setMessages([])
    })
    socket.on('main_player_question', (question: string) => setMainPlayerQuestion(question))
    socket.on('next_player_to_answer', (player: Player) => setNextPlayerThatAnswers(player))

    return () => {
      const events = [
        'room_history', 'receive_message', 'display_players', 'voting_result',
        'all_players_ready', 'round_score', 'round_started', 'questions_started',
        'main_player_question', 'next_player_to_answer',
      ]
      events.forEach(event => socket.off(event))
    }
  }, [socket])

  return {
    messages,
    players,
    mainPlayer,
    allPlayersReady,
    roundScore,
    isRoundStarted,
    questionsStarted,
    mainPlayerQuestion,
    nextPlayerThatAnswers,
  }
}