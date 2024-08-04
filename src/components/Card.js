import React from 'react';

const Card = ({ image, onClick, isDisabled, isCorrect }) => {
    const cardStyle = {
        border: isCorrect ? '2px solid gray' : '2px solid black',
        opacity: isCorrect ? 0.5 : 1,
    };

    return (
        <div style={cardStyle} onClick={onClick}>
            <img src={image} alt="card" />
        </div>
    );
};

export default Card;
