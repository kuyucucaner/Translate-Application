const express = require('express');
const router = express.router();
const TranslateController = require('../controllers/translate-controller');

router.post('/' , TranslateController.translateText);

module.exports = router;