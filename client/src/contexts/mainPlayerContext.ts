import { createContext } from 'react';
import { Player } from '../../../shared/types/game'


export const mainPlayerContext = createContext<Player | null>(null);