import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { checkAuth } from './store/slices/authSlice';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';

const AppContent: React.FC = () => {
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/threads/:id" element={<ThreadDetailPage />} />
        <Route path="/create" element={<CreateThreadPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;