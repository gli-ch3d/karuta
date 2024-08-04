import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from './Card';

const Game = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = location.state || { language: 'en' };
    const [cards, setCards] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [correctCards, setCorrectCards] = useState(new Set());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const cardNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
        const shuffled = cardNumbers.sort(() => 0.5 - Math.random()).slice(0, 10);
        setCards(shuffled);
        setNextPrompt(shuffled, 0);
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleIncorrect();
        }
    }, [timeLeft]);

    const setNextPrompt = (cards, index) => {
        if (index < cards.length) {
            fetch(`/prompts/${language}_${cards[index]}.txt`)
                .then((response) => response.text())
                .then((text) => {
                    setCurrentPrompt(text);
                    setTimeLeft(10);
                });
        } else {
            alert(`Game Over! Your score: ${score}`);
            navigate('/');
        }
    };

    const handleCardClick = (card) => {
        if (correctCards.has(card)) return;
        setSelectedCard(card);

        if (card === cards[score]) {
            setCorrectCards(new Set([...correctCards, card]));
            setScore(score + 1);
            setNextPrompt(cards, score + 1);
        } else {
            setTimeout(() => setSelectedCard(null), 500);
        }
    };

    const handleIncorrect = () => {
        setSelectedCard(null);
        setTimeLeft(10);
    };

    return (
        <div>
            <h2>Score: {score}</h2>
            <h3>Time Left: {timeLeft}</h3>
            <p>{currentPrompt}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {cards.map((card) => (
                    <Card
                        key={card}
                        image={`/assets/${card}.png`}
                        onClick={() => handleCardClick(card)}
                        isDisabled={correctCards.has(card)}
                        isCorrect={selectedCard === card && card === cards[score]}
                    />
                ))}
            </div>
            <button onClick={() => setTimeLeft(10)}>Next</button>
        </div>
    );
};

export default Game;
    