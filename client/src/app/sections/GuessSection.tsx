import React, { useState } from 'react'
import { Player } from '../../../../shared/types/game'
import Slider from '../../components/Slider'
import Button from '../../components/Button'

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
  const [sliderValue, setSliderValue] = useState(5)

  return (
    <div>
      {mainPlayer?.socketId === mySocketId && (
        <div className='mt-20 flex flex-col items-center gap-16'>
          <h2 className='text-lg'>GUESS THE CORRECT NUMBER BASED ON THE ANSWERS YOU'VE GOT</h2>

          <Slider value={sliderValue} onChange={setSliderValue} />

          <Button onClick={() => onGuess(sliderValue)}>
            ready
          </Button>
        </div>
      )}

      {mainPlayer?.socketId !== mySocketId && (
        <div className='mt-20'>
          <h2 className='text-2xl'>NOW {mainPlayer?.name.toUpperCase()} WILL MAKE A GUESS!</h2>
        </div>
      )}
    </div>
  )
}

export default GuessSection