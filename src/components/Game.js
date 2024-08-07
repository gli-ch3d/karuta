import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from './Card';

const Game = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = location.state || { language: 'en' };

    const [cards, setCards] = useState([]);
    const [shuffledPrompts, setShuffledPrompts] = useState([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [correctCards, setCorrectCards] = useState(new Set());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const cardNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
        const selectedCards = cardNumbers.sort(() => 0.5 - Math.random()).slice(0, 10);
        setCards(selectedCards.sort(() => 0.5 - Math.random())); // Shuffle cards

        // Fetch and shuffle prompts
        const fetchPrompts = async () => {
            const fetchedPrompts = await Promise.all(
                selectedCards.map((card) =>
                    fetch(`${process.env.PUBLIC_URL}/prompts/${language}_${card}.txt`).then((response) => response.text())
                )
            );
            setShuffledPrompts(fetchedPrompts);
        };

        fetchPrompts();
    }, [language]);

    useEffect(() => {
        if (shuffledPrompts.length > 0) {
            setNextPrompt(0);
        }
    }, [shuffledPrompts]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleIncorrect();
        }
    }, [timeLeft]);

    const setNextPrompt = (index) => {
        if (index < shuffledPrompts.length) {
            setCurrentPromptIndex(index);
            setTimeLeft(10);
        } else {
            alert(`Game Over! Your score: ${score}`);
            navigate('/');
        }
    };

    const handleCardClick = (card) => {
        if (correctCards.has(card)) return;
        setSelectedCard(card);

        if (card === cards[currentPromptIndex]) {
            setCorrectCards(new Set([...correctCards, card]));
            setScore(score + 1);
            setNextPrompt(currentPromptIndex + 1);
        } else {
            setTimeout(() => setSelectedCard(null), 500);
        }
    };

    const handleIncorrect = () => {
        setSelectedCard(null);
        setTimeLeft(10);
    };

    return (
        <div className="game-container">
            <h2>Score: {score}</h2>
            <h3>Time Left: {timeLeft}</h3>
            <p>{shuffledPrompts[currentPromptIndex]}</p>
            <div className="cards">
                {cards.map((card) => (
                    <Card
                        key={card}
                        image={`${process.env.PUBLIC_URL}/assets/${card}.png`}
                        onClick={() => handleCardClick(card)}
                        isDisabled={correctCards.has(card)}
                        isCorrect={selectedCard === card && card === cards[currentPromptIndex]}
                    />
                ))}
            </div>
            <button onClick={() => setTimeLeft(10)}>Next</button>
        </div>
    );
};

export default Game;

    const handleIncorrect = () => {
        setSelectedCard(null);
        setTimeLeft(10);
    };

    return (
        <div className="game-container">
            <h2>Score: {score}</h2>
            <h3>Time Left: {timeLeft}</h3>
            <p>{currentPrompt}</p>
            <div className="cards">
                {cards.map((card) => (
                    <Card
                        key={card}
                        image={`${process.env.PUBLIC_URL}/assets/${card}.png`}
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
