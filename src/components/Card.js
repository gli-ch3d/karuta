import React from 'react';

const Card = ({ image, onClick, isDisabled, isCorrect }) => {
    let className = 'card';
    if (isDisabled) className += ' disabled';
    if (isCorrect) className += ' correct';

    return (
        <div className={className} onClick={isDisabled ? null : onClick}>
            <img src={image} alt="Card" />
        </div>
    );
};

export default Card;
