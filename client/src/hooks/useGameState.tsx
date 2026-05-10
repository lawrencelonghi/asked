import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Message, Player, QAItem } from '../../../shared/types/game'

export function useGameState(socket: Socket | null) {
  const [ messages, setMessages ] = useState<Message[]>([])
  const [ players, setPlayers ] = useState<Player[]>([ ])
  const [ mainPlayer, setMainPlayer ] = useState<Player | null>(null)
  const [ allPlayersReady, setAllPlayersReady ] = useState(false)
  const [ roundScore, setRoundScore ] = useState<number | null>(null)
  const [ isRoundStarted, setIsRoundStarted ] = useState(false)
  const [ questionsStarted, setQuestionsStarted ] = useState(false)
  const [ mainPlayerQuestion, setMainPlayerQuestion ] = useState('')
  const [ nextPlayerToAnswer, setNextPlayerToAnswer ] = useState<Player | null>(null)
  const [ playerAnswer, setPlayerAnswer ] = useState('')
  const [ qaList, setQaList ] = useState<QAItem[] | null>(null)
  const [ isGuessSectionStarted, setIsGuessSectionStarted ] = useState(false)
  const [ isResultSectionStarted, setIsResultSectionStarted ] = useState(false)
  const [ isMainPlayerWinner, setIsMainPlayerWinner ] = useState<boolean | null>(null)
  const [ isNewRoundStarted, setIsNewRoundStarted ] = useState(false)

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
    socket.on('next_player_to_answer', (player: Player) => {
      setNextPlayerToAnswer(player)
      setMainPlayerQuestion('')
      setPlayerAnswer('')
    })
    socket.on('player_answer', (answer: string) => setPlayerAnswer(answer))
    socket.on('qa_list', (qaList) => setQaList(qaList))
    socket.on('start_guess', (data) => setIsGuessSectionStarted(data))
    socket.on('start_game_result', (data) => setIsResultSectionStarted(data))
    socket.on('isMainPlayer_winner', (result) => setIsMainPlayerWinner(result))
    socket.on('new_round_started', (data) => {
      setIsNewRoundStarted(data)

      setMainPlayer(null)
      setAllPlayersReady(false)
      setRoundScore(null)
      setQuestionsStarted(false)
      setMainPlayerQuestion('')
      setNextPlayerToAnswer(null)
      setPlayerAnswer('')
      setQaList(null)
      setIsGuessSectionStarted(false)
      setIsResultSectionStarted(false)
      setIsMainPlayerWinner(null)
      setIsRoundStarted(false) 
    })
    return () => {
      const events = [
        'room_history', 'receive_message', 'display_players', 'voting_result',
        'all_players_ready', 'round_score', 'round_started', 'questions_started',
        'main_player_question', 'next_player_to_answer', 'player_answer', 'qa_list',
        'start_guess', 'start_game_result', 'isMainPlayer_winner', 'new_round_started'
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
    nextPlayerToAnswer,
    playerAnswer,
    qaList,
    isGuessSectionStarted,
    isResultSectionStarted,
    isMainPlayerWinner,
    isNewRoundStarted
  }
}