import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { testFirestoreConnection } from './lib/firebase';
import './index.css';

// Validate connection to Firestore on initial boot
testFirestoreConnection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <WebSocketProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WebSocketProvider>
    </ErrorBoundary>
  </StrictMode>,
);
