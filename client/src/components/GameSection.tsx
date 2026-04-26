import React from 'react'
import { io, Socket} from 'socket.io-client';
import { Player } from '../../../shared/types/game';
import Button from './Button';

interface GameSectionProps {
  players: Player[]
  mainPlayer: Player | null
  mySocketId: string | null
  nextPlayerThatAnswers: Player | null
  mainPlayerQuestion: string | null
  roundScore: number | null
  handleMainPlayerQuestion: (e: React.FormEvent) => void
  onQuestionChange: (value: string) => void
}


const GameSection = ({
  players, 
  mainPlayer, 
  mySocketId,
  nextPlayerThatAnswers,
  mainPlayerQuestion, 
  roundScore, 
  handleMainPlayerQuestion,
  onQuestionChange}: GameSectionProps) => {

  return (

    <div className='flex flex-col items-center gap-20 mt-20'>

      {mySocketId === mainPlayer?.socketId && (
        <div className='flex flex-col items-center gap-12'>
          <div>
            <h2 className='text-xl font-semibold'>
              You ask {nextPlayerThatAnswers?.name} a question.
            </h2>
          </div>

          <form onSubmit={handleMainPlayerQuestion} className='flex flex-col gap-12 items-center'>
            <textarea rows={1}
                    placeholder='ask your question' 
                    className='border-b text-xl text-center focus:outline-none resize-none overflow-hidden w-96'
                    onChange={(e) =>{
                      e.target.style.height = 'auto'
                      e.target.style.height = e.target.scrollHeight + 'px'
                      onQuestionChange(e.target.value)}
                    }
              />

              <Button text='ENTER'/>
        
        </form>
      </div>
      )}


      <div className='flex flex-col gap-10'>
        <h2>{mainPlayer?.name} will ask {nextPlayerThatAnswers?.name} a question!</h2>
        <span>{mainPlayer?.name}'s question is:</span>
        <span>{mainPlayerQuestion}</span>
      </div>

    </div>
  )
}

export default GameSection