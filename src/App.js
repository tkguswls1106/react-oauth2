import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import FirstPage from './pages/FirstPage';
import LoginPage from './pages/LoginPage';
import LoginWaitPage from './pages/LoginWaitPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginwait" element={<LoginWaitPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
