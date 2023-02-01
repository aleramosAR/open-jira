import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useSnackbar } from "notistack";
import { EntriesContext, entriesReducer } from './';
import { Entry } from '@/interfaces';
import { entriesApi } from '@/apis';

export interface EntriesState {
  entries: Entry[];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: []
}

interface ProviderProps { children: ReactNode }

export const EntriesProvider:FC<ProviderProps> = ({children}) => {

  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);
  const { enqueueSnackbar } = useSnackbar();

  const addNewEntry = async(description:string) => {
    // const newEntry:Entry = {
    //   _id: uuidv4(),
    //   description,
    //   createdAt: Date.now(),
    //   status: 'pending'
    // }
    const { data } = await entriesApi.post<Entry>('/entries', { description })
    dispatch({ type: '[Entry] - Add entry', payload: data});
  }

  const removeEntry = async(id:string) => {
    try {
      await entriesApi.delete<Entry>(`/entries/${id}`);
      dispatch({ type: '[Entry] - Entry removed', payload: {id}});

      enqueueSnackbar('Entrada eliminada', {
        variant: 'error',
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateEntry = async({ _id, description, status }:Entry, showSnackBar = false) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status })
      dispatch({ type: '[Entry] - Entry updated', payload: data});

      if(showSnackBar) {
        enqueueSnackbar('Entrada actualizada', {
          variant: 'success',
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      }

    } catch (error) {
      console.log({error});
    }
  }

  const refreshEntries = async() => {
    const { data } = await entriesApi.get<Entry[]>('/entries');
    dispatch({ type: '[Entry] - Refresh data', payload: data});
  }

  useEffect(() => {
    refreshEntries();
  }, [])
  

  return (
    <EntriesContext.Provider value={{
      ...state,

      // Methods
      removeEntry,
      addNewEntry,
      updateEntry
    }}>
      {children}
    </EntriesContext.Provider>
  )
}