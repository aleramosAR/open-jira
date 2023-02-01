import { EntriesProvider } from '@/context/entries'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { darkTheme, lightTheme } from '@/themes'
import { UIProvider } from '@/context/ui'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider maxSnack={3}>
      <EntriesProvider>
        <UIProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UIProvider>
      </EntriesProvider>
    </SnackbarProvider>
  )
}
