const axios = require('axios');
require('dotenv').config(); // .env dosyasını yükler
const Tesseract = require('tesseract.js');
const { analyzeText } = require('../utils/translate-util'); // Metin analiz fonksiyonunu içe aktarın
 


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
        
    },
    processImageAndTranslate: async function (req, res) {
        const { targetLanguage } = req.body;

        if (!req.file || !targetLanguage) {
            return res.status(400).json({ error: 'Image or targetLanguage is missing!' });
        }

        try {
            // 1. OCR İşlemi
            const imagePath = req.file.path; // Yüklenen resim yolu
            const ocrResult = await Tesseract.recognize(imagePath, 'eng'); // OCR işlemi
            const detectedText = ocrResult.data.text.trim();
            console.log('Detected Text:', detectedText);

            // 2. Çeviri İşlemi
            const translateResponse = await axios.post(
                `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
                { q: detectedText, target: targetLanguage }
            );

            const translatedText = translateResponse.data.data.translations[0].translatedText;

            res.status(200).json({ detectedText, translatedText });
        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json({ error: 'OCR or Translation Failed!', details: err.message });
        }
    },  
    analyzeText: async function (req, res) {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required for analysis!' });
        }

        try {
            const analysisResult = analyzeText(text); // Metni analiz et
            res.status(200).json(analysisResult); // Analiz sonuçlarını döndür
        } catch (err) {
            console.error('Error analyzing text:', err.message);
            res.status(500).json({ error: 'Text Analysis Failed!', details: err.message });
        }
    }

};

module.exports = TranslateController;