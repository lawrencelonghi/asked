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
  questionInput: string
  handleMainPlayerQuestion: (e: React.FormEvent) => void
  onQuestionChange: (value: string) => void
  playerAnswer: string | null 
  handlePlayerAnswer: (e: React.FormEvent) => void 
  onAnswerChange: (value: string) => void
  answerInput: string
}


const GameSection = ({
  players, 
  mainPlayer, 
  mySocketId,
  nextPlayerThatAnswers,
  mainPlayerQuestion, 
  roundScore, 
  questionInput,
  handleMainPlayerQuestion,
  onQuestionChange,
  playerAnswer,
  handlePlayerAnswer,
  onAnswerChange,
  answerInput }: GameSectionProps) => {

  return (

    <div className='flex flex-col items-center gap-20 mt-20'>

      {/* Main player question */}
      {mySocketId === mainPlayer?.socketId && (
        <div className='flex flex-col items-center gap-12'>
          <div>
            <h2 className='text-xl font-semibold'>
              You ask {nextPlayerThatAnswers?.name} a question.
            </h2>
          </div>

          <form onSubmit={handleMainPlayerQuestion} className='flex flex-col gap-12 items-center'>
            <textarea 
                  rows={1}
                  value={questionInput}  
                  placeholder='ask your question' 
                  className='border-b text-xl text-center focus:outline-none resize-none overflow-hidden w-96'
                  onChange={(e) =>{
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                    onQuestionChange(e.target.value)}
                  }
              />

              <Button text='ENTER'/>
              {mainPlayerQuestion && (
                <span className='text-green-500 text-lg'>Question sent!</span>
              )}
        
        </form>
      </div>
      )}

      {/* players answers */}
      {mySocketId !== mainPlayer?.socketId && (
        <div className='flex flex-col text-center'>
          <div className='flex flex-col gap-14'>

            {!mainPlayerQuestion && (
              <h2 className='text-xl font-semibold'>
                {mainPlayer?.name} will ask {nextPlayerThatAnswers?.name} a question!
              </h2>
            )}

            {mainPlayerQuestion && (
              <div className='flex flex-col gap-20'>
                <div className='flex flex-col gap-6'>
                  <span>{mainPlayer?.name}'s question is:</span>
                  <span className='text-xl font-semibold text-orange-500'>{mainPlayerQuestion}</span>
                </div>

        <div className='flex flex-col items-center gap-12'>

          <form onSubmit={handlePlayerAnswer} className='flex flex-col gap-12 items-center'>
            <textarea 
                  rows={1}
                  value={answerInput}  
                  placeholder='Type your answer' 
                  className='border-b text-xl text-center focus:outline-none resize-none overflow-hidden w-96'
                  onChange={(e) =>{
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                    onAnswerChange(e.target.value)}
                  }
              />

              <Button text='ENTER'/>
              {playerAnswer && (
                <span className='text-green-500 text-lg'>Answer sent!</span>
              )}
        
        </form>
      </div>
              </div>
            )}

          </div>
        </div>
      )}


    </div>
  )
}

export default GameSection