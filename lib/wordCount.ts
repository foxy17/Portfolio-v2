const wordCount = (content, targetWord) => {
    const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
    const matches = content.match(regex);
    return matches ? matches.length : 0;
};

export default wordCount;