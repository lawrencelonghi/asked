import React from 'react'
import { Player } from '../../../shared/types/game'

interface GuessSectionProps {
  mainPlayer: Player | null
  players: Player[]
  mySocketId: string
  roundScore: number | null
  guess: number | null
  onGuess: (number: number) => void
  isGuessingComplete: boolean
}

const GuessSection = ({mainPlayer, players, mySocketId, roundScore, guess, onGuess, isGuessingComplete}: GuessSectionProps) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      {/* mainPlayer */}
      {mainPlayer?.socketId === mySocketId && (
        <div>
          <h2>Now guess the correct number based on the answers you've got!</h2>

          <ul className='grid grid-cols-3 gap-6'>
            {numbers.map(number => (
              <li
                key={number}
                className={`border text-center max-w-30 text-md px-4 py-2 cursor-pointer
                  ${guess === number
                    ? 'bg-white text-black'          
                    : 'hover:bg-white hover:text-black'
                  }`}
                onClick={() => onGuess(number)}
              >
                {number}
              </li>
            ))}
            <li className={`border text-center max-w-30 text-sm px-3 py-2 cursor-pointer
              ${isGuessingComplete
                ? 'bg-green-600 text-black'           // confirmado
                : 'text-green-600 hover:bg-green-600 hover:text-black'
              }`}>
              ready
            </li>
          </ul>
        </div>
      )}

      {/* spectators */}
      {mainPlayer?.socketId !== mySocketId && (
        <div>
          <h2>{mainPlayer?.name} will make a guess!</h2>
        </div>
      )}

    </div>
  )
}

export default GuessSection