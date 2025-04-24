import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './contexts/UserContext.jsx';
import { ConnectionProvider } from './contexts/ConnectionContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <ConnectionProvider>
          <App />
        </ConnectionProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);
