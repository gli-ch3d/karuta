import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TitlePage = () => {
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/game', { state: { language } });
    };

    return (
        <div className="game-container">
            <h1>Karuta Game</h1>
            <p>Select Language:</p>
            <select onChange={(e) => setLanguage(e.target.value)} value={language}>
                <option value="en">English</option>
                <option value="jp">Japanese</option>
                <option value="pt">Portuguese</option>
            </select>
            <button onClick={handleStart}>Start Game</button>
        </div>
    );
};

export default TitlePage;
