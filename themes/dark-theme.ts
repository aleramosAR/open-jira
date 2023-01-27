import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      main: '#19857B'
    },
    error: {
      main: red.A400
    }, 
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4A148C'
        }
      },
      defaultProps: {
        elevation: 0
      }
    },
  }
});