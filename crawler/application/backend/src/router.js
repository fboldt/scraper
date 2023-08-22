const express = require('express');

const resultsController = require('./controllers/resultsController')

const resultsMiddleware = require('./middlewares/resultsMiddleware')

const router = express.Router();

//Essa rota será responsável para retornar para a tabela o resultado do crawler.
router.post('/results', resultsMiddleware.validateBody, resultsController.createCrawlerResults);

module.exports = router;