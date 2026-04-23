'use client'
import { useContext, useState } from 'react';
import { io, Socket} from 'socket.io-client';
import { mainPlayerContext } from '@/contexts/mainPlayerContext';

interface ChooseNumberSectionProps {
  choosedNumber: number | null;
  isChoosingComplete: boolean;
  onChoose: (number: number) => void;
  roundScore: number | null
  mySocketId: string;
}

export default function ChooseNumber ({ choosedNumber, isChoosingComplete, onChoose,
   roundScore,mySocketId }: ChooseNumberSectionProps) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const mainPlayer = useContext(mainPlayerContext)
  const isMainPlayer = mainPlayer?.socketId === mySocketId;

  return (
    <div className=''>
      {/* Choosing number interface  */}
      {!isMainPlayer && ( 
        <div className='flex flex-col items-center gap-20 mt-20'>
          <div className='flex flex-col items-center gap-2'>
            <h2 className='text-2xl font-semibold'>MAIN PLAYER IS PAUSED.</h2>
            <h3 className='text-xl font-semibold'>NOW YOU AND YOUR FRIENDS MUST CHOOSE A NUMBER.</h3>
          </div>

          <ul className='grid grid-cols-3 gap-6'>
            {numbers.map(number => (
              <li
                key={number}
                className={`border text-center max-w-30 text-md px-4 py-2 cursor-pointer
                  ${choosedNumber === number
                    ? 'bg-white text-black'          
                    : 'hover:bg-white hover:text-black'
                  }`}
                onClick={() => onChoose(number)}
              >
                {number}
              </li>
            ))}
            <li className={`border text-center max-w-30 text-sm px-3 py-2 cursor-pointer
              ${isChoosingComplete
                ? 'bg-green-600 text-black'           // confirmado
                : 'text-green-600 hover:bg-green-600 hover:text-black'
              }`}>
              ready
            </li>
          </ul>

              <span>{roundScore}</span>

      </div>)}
      {/* main player paused interface */}
      
      {isMainPlayer && (
        <div className='fixed inset-0 flex flex-col items-center gap-2 mt-14 '>
          <h2 className='text-2xl font-semibold'>YOU ARE THIS ROUND'S MAIN PLAYER.</h2>
          <h3 className='text-xl font-semibold'>NOW WAIT WHILE YOUR FRIENDS PICK A NUMBER.</h3>
          <p className='text-center max-w-xl'>you will have to find out which number (0 to 10) they picked by asking them questions.</p>
        </div>
      )}

    </div>
  );
};
