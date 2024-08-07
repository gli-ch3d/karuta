import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks for routing
import Card from './Card'; // Import Card component

const Game = () => {
    const location = useLocation(); // Hook to get the current route location
    const navigate = useNavigate(); // Hook to navigate programmatically
    const { language } = location.state || { language: 'en' }; // Get language from route state or default to 'en'

    const [cards, setCards] = useState([]); // State for selected cards
    const [prompts, setPrompts] = useState([]); // State for fetched prompts
    const [shuffledCards, setShuffledCards] = useState([]); // State for shuffled cards
    const [shuffledPrompts, setShuffledPrompts] = useState([]); // State for shuffled prompts
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0); // State for current prompt index
    const [correctCards, setCorrectCards] = useState(new Set()); // State for correct cards
    const [score, setScore] = useState(0); // State for score
    const [timeLeft, setTimeLeft] = useState(10); // State for timer
    const [selectedCard, setSelectedCard] = useState(null); // State for selected card

    useEffect(() => {
        const cardNumbers = Array.from({ length: 13 }, (_, i) => i + 1); // Create an array of numbers 1 to 13
        const selectedCards = cardNumbers.sort(() => 0.5 - Math.random()).slice(0, 10); // Select 10 random cards
        setCards(selectedCards); // Set selected cards state

        const shuffledSelectedCards = [...selectedCards].sort(() => 0.5 - Math.random()); // Shuffle the selected cards
        setShuffledCards(shuffledSelectedCards); // Set shuffled cards state

        // Fetch prompts for the selected cards
        const fetchPrompts = async () => {
            const fetchedPrompts = await Promise.all(
                selectedCards.map((card) =>
                    fetch(`${process.env.PUBLIC_URL}/prompts/${language}_${card}.txt`).then((response) => response.text())
                )
            );
            setPrompts(fetchedPrompts); // Set prompts state
            setShuffledPrompts([...fetchedPrompts].sort(() => 0.5 - Math.random())); // Shuffle and set shuffled prompts state
        };

        fetchPrompts(); // Call the fetchPrompts function
    }, [language]); // Dependency array to run effect only when language changes

    useEffect(() => {
        if (shuffledPrompts.length > 0) {
            setNextPrompt(0); // Initialize first prompt when shuffled prompts are ready
        }
    }, [shuffledPrompts]); // Dependency array to run effect only when shuffled prompts change

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); // Decrement timer every second
            return () => clearTimeout(timer); // Clear timeout on component unmount or timeLeft change
        } else {
            handleIncorrect(); // Handle incorrect answer when time runs out
        }
    }, [timeLeft]); // Dependency array to run effect only when timeLeft changes

    const setNextPrompt = (index) => {
        if (index < shuffledPrompts.length) {
            setCurrentPromptIndex(index); // Set current prompt index
            setTimeLeft(10); // Reset timer
        } else {
            alert(`Game Over! Your score: ${score}`); // Alert game over and score
            navigate('/'); // Navigate back to home
        }
    };

    const handleCardClick = (card) => {
        if (correctCards.has(card)) return; // Do nothing if card is already correct
        setSelectedCard(card); // Set selected card state

        const correctCard = cards[prompts.indexOf(shuffledPrompts[currentPromptIndex])]; // Find the correct card for the current prompt
        if (card === correctCard) {
            setCorrectCards(new Set([...correctCards, card])); // Add card to correct cards
            setScore(score + 1); // Increment score
            setNextPrompt(currentPromptIndex + 1); // Move to next prompt
        } else {
            setTimeout(() => setSelectedCard(null), 500); // Reset selected card after half a second
        }
    };

    const handleIncorrect = () => {
        setSelectedCard(null); // Reset selected card
        setTimeLeft(10); // Reset timer
    };

    return (
        <div className="game-container">
            <h2>Score: {score}</h2> {/* Display score */}
            <h3>Time Left: {timeLeft}</h3> {/* Display timer */}
            <p>{shuffledPrompts[currentPromptIndex]}</p> {/* Display current prompt */}
            <div className="cards">
                {shuffledCards.map((card) => (
                    <Card
                        key={card}
                        image={`${process.env.PUBLIC_URL}/assets/${card}.png`} // Set card image source
                        onClick={() => handleCardClick(card)} // Handle card click
                        isDisabled={correctCards.has(card)} // Disable card if already correct
                        isCorrect={selectedCard === card && card === cards[prompts.indexOf(shuffledPrompts[currentPromptIndex])]} // Highlight card if correct
                    />
                ))}
            </div>
            <button onClick={() => setTimeLeft(10)}>Next</button> {/* Button to reset timer */}
        </div>
    );
};

export default Game;
