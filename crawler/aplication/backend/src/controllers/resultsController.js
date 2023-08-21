const { crawl } = require('../services/crawler');

const createCrawlerResults = async (req, res) => {

    try {
      const { url } = req.body;
      const result = await crawl(url);
      res.setHeader('Content-Type', 'application/json');
      res.send(result);

    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao executar o crawler.');
    }
};

module.exports = {
    createCrawlerResults
};