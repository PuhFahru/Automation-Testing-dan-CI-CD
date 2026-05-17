import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import './index.css';
import App from './App';
import LoadingSpinner from './components/LoadingSpinner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner size="lg" />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);