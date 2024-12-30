const axios = require('axios');

const TranslateController =  {

    translateText : async function (req ,res ){
            const { text , targetLanguage } = req.body;

            try {
                const response = await axios.post('https://libretranslate.de/translate' , {
                    q: text,
                    source: 'auto',
                    target: targetLanguage
                });
                res.status(201).json({translatedText : response.data.translatedText});
            }
            catch (err){
                res.status(500).json({ error: 'Translation Failed!' });
            }
    }

};

module.exports = TranslateController;