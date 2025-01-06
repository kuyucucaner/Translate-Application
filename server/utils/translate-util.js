const nlp = require('compromise');

const analyzeText = (text) => {
    const doc = nlp(text);

    const wordCount = doc.wordCount(); // Kelime sayısı
    const sentenceCount = doc.sentences().length; // Cümle sayısı
    const uniqueWords = [...new Set(text.split(/\s+/))].length; // Benzersiz kelime sayısı
    const avgWordLength = (text.replace(/\s/g, '').length / wordCount).toFixed(2); // Ortalama kelime uzunluğu

    return {
        wordCount,
        sentenceCount,
        uniqueWords,
        avgWordLength,
    };
};

module.exports = { analyzeText };
