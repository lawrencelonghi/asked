import { Player } from '../../../../shared/types/game'
import Button from '@/components/Button'

interface ResultSectionProps {
  isMainPlayerWinner?: boolean | null
  mainPlayer: Player | null
  players: Player[]
  mySocketId: string
  onStartNewRound: () => void
}

const ResultSection = ({
  isMainPlayerWinner, 
  mainPlayer, 
  players,
  mySocketId,
  onStartNewRound }: ResultSectionProps) => {

  function handleStartNewRound() {
    
  }

  return (
    <div>
      {/* mainPlayer */}
      {mainPlayer?.socketId === mySocketId && (
        <div className='mt-18 flex flex-col gap-30'>
          {/* mainPlayer is winner */}
          {isMainPlayerWinner && (
            <div>
              <h2 className='text-6xl text-green-600'>ACERTOU</h2>
            </div>
          )}
          {/* mainPlayer is a looser */}
          {!isMainPlayerWinner && (
            <div>
              <h2 className='text-6xl text-red-600'>ERROU</h2>
            </div>
          )}

          <Button children='Start new round' onClick={onStartNewRound}></Button>
        </div>
      )}

      {/* spectators */}
      {mainPlayer?.socketId !== mySocketId && (
        <div>
          {/* mainPlayer is winner */}
          {isMainPlayerWinner && (
            <div>
              <h2>{mainPlayer?.name.toUpperCase()} ACERTOU</h2>
            </div>
          )}
          {/* mainPlayer is a looser */}
          {!isMainPlayerWinner && (
            <div>
              <h2>{mainPlayer?.name.toUpperCase()} ERROU</h2>
            </div>
          )}
        </div>        
      )}
    </div>
  )
}

export default ResultSection