import { FC, ReactNode, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EntriesContext, entriesReducer } from './';
import { Entry } from '@/interfaces';

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [{
    _id: uuidv4(),
    description: 'Pendiente: In dolor est labore et nostrud proident Lorem deserunt nulla qui et nulla ipsum officia.',
    status: 'pending',
    createdAt: Date.now(),
  },
  {
    _id: uuidv4(),
    description: 'En progreso. Consequat deserunt elit adipisicing dolor quis laboris eu voluptate officia.',
    status: 'in-progress',
    createdAt: Date.now() - 1000000,
  },
  {
    _id: uuidv4(),
    description: 'Terminadas. Tempor do irure aliquip elit cupidatat mollit voluptate aliqua aliquip.',
    status: 'finished',
    createdAt: Date.now() - 100000,
  }],
}

interface ProviderProps { children: ReactNode }

export const EntriesProvider:FC<ProviderProps> = ({children}) => {

  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

  const addNewEntry = (description:string) => {
    const newEntry:Entry = {
      _id: uuidv4(),
      description,
      createdAt: Date.now(),
      status: 'pending'
    }

    dispatch({ type: '[Entry] - Add entry', payload: newEntry});
  }

  const updateEntry = (entry:Entry) => {
    dispatch({ type: '[Entry] - Entry updated', payload: entry});
  }

  return (
    <EntriesContext.Provider value={{
      ...state,

      // Methods
      addNewEntry,
      updateEntry
    }}>
      {children}
    </EntriesContext.Provider>
  )
}