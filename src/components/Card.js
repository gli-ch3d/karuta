import React from 'react';

const Card = ({ image, onClick, isDisabled, isCorrect }) => {
    const cardClass = `card ${isDisabled ? 'disabled' : ''} ${isCorrect ? 'correct' : ''}`;

    return (
        <div className={cardClass} onClick={onClick}>
            <img src={image} alt="card" />
        </div>
    );
};

export default Card;
