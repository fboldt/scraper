const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Database Scraper\nhttps://github.com/fboldt/scraper");
});

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
