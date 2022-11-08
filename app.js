const express = require("express");
const { geraJson } = require("./scraper");

app = express();
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))

app.post("/", async (req, res) => {
    console.time('scraping')
    const url = req.body.url
    const quantidade = req.body.quantidade
    res.end(await geraJson(url, quantidade))
    console.timeEnd('scraping')
});

const port = process.env.PORT || 3000

const start = async () => {
    try {
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};
start()
