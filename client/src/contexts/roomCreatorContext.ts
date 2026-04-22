import { createContext } from 'react';
import { Player } from '../../../shared/types/game'


export const roomCreatorContext = createContext<Player | null>(null);