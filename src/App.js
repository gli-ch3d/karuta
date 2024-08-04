import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitlePage from './components/TitlePage';
import Game from './components/Game';

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
