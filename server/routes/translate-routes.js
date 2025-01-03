const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Yükleme dizini
const TranslateController = require('../controllers/translate-controller');

router.post('/' , TranslateController.translateText);

router.post('/ocr-translate', upload.single('image'), TranslateController.processImageAndTranslate);

module.exports = router;