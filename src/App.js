import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/Game';
import TitlePage from './components/TitlePage';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TitlePage />} />
                <Route path="/game" element={<Game />} />
            </Routes>
        </Router>
    );
};

export default App;
