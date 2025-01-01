const axios = require('axios');

const TranslateController =  {

    translateText: async function (req, res) {
        console.log('Request Body:', req.body); // Gelen isteği kontrol edin
        const { text, targetLanguage } = req.body;
        
        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Text or targetLanguage is missing!' });
        }
    
        try {
            const response = await axios.post('https://libretranslate.de/translate', {
                q: text,
                source: 'auto',
                target: targetLanguage,
            });
        
            if (response.data && response.data.translatedText) {
                res.status(201).json({ translatedText: response.data.translatedText });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json({ error: 'Translation Failed!', details: err.message });
        }
        
    }
    

};

module.exports = TranslateController;