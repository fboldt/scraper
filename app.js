const express = require("express");
const { geraJson } = require("./scraper");

app = express();
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
    console.time('scraping')
    const url = 'https://en.wikipedia.org/wiki/List_of_dog_breeds'
    const quantidade = 5
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
