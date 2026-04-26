'use client'
import type { Player } from '../../../shared/types/game'
import Button from '@/components/Button'

interface VotingSectionProps {
  players: Player[]
  votedPlayer: Player | null
  playerHasVoted: boolean
  mainPlayer: Player | null
  isVotingCompleted: boolean
  onVote: (player: Player) => void
  onGetReady: () => void
}

export default function VotingSection({
  players,
  votedPlayer,
  playerHasVoted,
  mainPlayer,
  isVotingCompleted,
  onVote,
  onGetReady,
}: VotingSectionProps) {
  return (
    <div className='flex flex-col items-center gap-20 mt-20'>
      <h2 className='text-2xl font-semibold'>WHO SHOULD PLAY NOW?</h2>

      <ul className='grid grid-cols-3 gap-6'>
        {players.map(p => (
          <li
            key={p.name}
            className={
              votedPlayer?.socketId === p.socketId
                ? 'border text-center text-black bg-green-500 max-w-30 text-md px-4 py-2'
                : 'border text-center max-w-30 text-md px-4 py-2 hover:bg-white cursor-pointer hover:text-black'
            }
            onClick={() => !playerHasVoted && onVote(p)}
          >
            {p.name.toUpperCase()}
          </li>
        ))}
      </ul>

      <span>
        SELECTED PLAYER:
        <span className='text-green-500 text-2xl font-bold tracking-wide ml-2'>
          {mainPlayer?.name.toUpperCase()}
        </span>
      </span>

      {isVotingCompleted && (
        <Button text='START GAME' 
                onClick={onGetReady} />
      )}
    </div>
  )
}