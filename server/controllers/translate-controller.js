const axios = require('axios');
require('dotenv').config(); // .env dosyasını yükler


const TranslateController =  {

    translateText: async function (req, res) {
        console.log('Request Body:', req.body); // Gelen isteği kontrol edin
        const { text, targetLanguage } = req.body;
        
        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Text or targetLanguage is missing!' });
        }
    
        try {
            const response = await axios.post(
                `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
                {
                  q: text,
                  target: targetLanguage,
                }
              );
        
              // Yanıtı döndür
              res.status(200).json({ translatedText: response.data.data.translations[0].translatedText });
        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json({ error: 'Translation Failed!', details: err.message });
        }
        
    }
    

};

module.exports = TranslateController;