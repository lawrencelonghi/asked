'use client'
import { useContext, useState } from 'react';
import { mainPlayerContext } from '@/contexts/mainPlayerContext';
import Slider from '@/components/Slider';
import Button from '@/components/Button'

interface ChosseScoreSectionProps {
  choosedNumber: number | null;
  isChoosingComplete: boolean;
  onChoose: (number: number) => void;
  roundScore: number | null
  mySocketId: string;
}

export default function ChooseScore ({ choosedNumber, isChoosingComplete, onChoose,
   roundScore, mySocketId }: ChosseScoreSectionProps) {
  const mainPlayer = useContext(mainPlayerContext)
  const isMainPlayer = mainPlayer?.socketId === mySocketId;
  const [sliderValue, setSliderValue] = useState(5)

  return (
    <div>
      {!isMainPlayer && ( 
        <div className='flex flex-col items-center gap-20 mt-20'>
          <div className='flex flex-col items-center gap-2'>
            <h2 className='text-2xl font-semibold'>{mainPlayer?.name.toUpperCase()} IS PAUSED.</h2>
            <h3 className='text-xl font-semibold'>NOW YOU AND YOUR FRIENDS MUST CHOOSE A NUMBER.</h3>
          </div>

          <Slider value={sliderValue} onChange={setSliderValue} />

          <Button onClick={() => onChoose(sliderValue)}>
            ready
          </Button>
        </div>
      )}

      {isMainPlayer && (
        <div className='fixed inset-0 flex flex-col items-center gap-2 mt-14'>
          <h2 className='text-2xl font-semibold'>YOU ARE THIS ROUND'S MAIN PLAYER.</h2>
          <h3 className='text-xl font-semibold'>NOW WAIT WHILE YOUR FRIENDS PICK A NUMBER.</h3>
          <p className='text-center max-w-xl'>you will have to find out which number (0 to 10) they picked by asking them questions.</p>
        </div>
      )}
    </div>
  );
};