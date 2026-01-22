import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
import { AuthProvider } from './modules/auth/AuthContext';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8'
    },
    secondary: {
      main: '#5f6368'
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 12
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

