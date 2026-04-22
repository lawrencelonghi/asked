import React from 'react'
import { Player } from '../../../shared/types/game'
import Button from './Button'

interface WaitingPlayersSectionProps {
  players: Player[]
  roomCreator: Player | null
  mySocketId: string
}

const WaitingPlayers = ({ players, roomCreator, isCreator }: { 
  players: Player[], 
  roomCreator: Player | null,
  isCreator: boolean
}) => {

  return (
    <div className='flex flex-col items-center gap-20 mt-20'>
      {isCreator ? (
        <>
          <h2 className='text-2xl font-semibold'>You are the room creator.</h2>
          <p>Wait for your friends and then start the round</p>
          <Button text='Start Round' />
        </>
      ) : (
        <h2 className='text-2xl font-semibold'>Waiting for players...</h2>
      )}
    </div>
  )
}

export default WaitingPlayers