import React from 'react';

const StyledWord = ({ word }) => {
    const getColorClass = (word) => {
        switch (word.toLowerCase()) {
            case 'javascript':
                return 'text-yellow-500';
            case 'typescript':
                return 'text-blue-500';
            case 'html':
                return 'text-red-500';
            case 'css':
                return 'text-indigo-500';
            default:
                return 'text-gray-500';
        }
    };

    const colorClass = getColorClass(word);

    return (
        <span className={`inline-block ${colorClass}`}>
      {word}
    </span>
    );
};

export default StyledWord;