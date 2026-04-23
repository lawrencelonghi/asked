import React from 'react'
import { io, Socket} from 'socket.io-client';
import { Player } from '../../../shared/types/game';
import Button from './Button';

interface GameSectionProps {
  players: Player[]
  mainPlayer: Player | null
  playerThatAnswers: Player | null
  mainPlayerQuestion: string | null
  playerAnswer: string | null
  roundScore: number | null
  finalGuess: number | null
  handleMainPlayerQuestion: () => void
  onQuestionChange: (value: string) => void
}


const GameSection = ({
  players, 
  mainPlayer, 
  playerThatAnswers,
  mainPlayerQuestion, 
  playerAnswer, 
  roundScore, 
  finalGuess,
  handleMainPlayerQuestion,
  onQuestionChange}: GameSectionProps) => {

  return (

    <div className='flex flex-col items-center gap-20 mt-20'>

      {mainPlayer && (
        <div className='flex flex-col items-center gap-12'>
          <div>
            <h2 className='text-xl font-semibold'>
              You ask {playerThatAnswers?.socketId} a question.
            </h2>
          </div>

          <form onSubmit={handleMainPlayerQuestion}>
            <input type="text" 
                    placeholder='ask your question' 
                    className='border-b text-xl text-center focus:outline-none'
                    onChange={(e) => onQuestionChange(e.target.value)}
              />

              <Button text='ENTER'/>
        
        </form>
      </div>
      )}


    {playerThatAnswers && (
      <div>

      </div>
    )}

    </div>
  )
}

export default GameSection