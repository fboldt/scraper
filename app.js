import express, {urlencoded } from "express";
import { crawl } from "./ImgCrawler.js";

const app = express();
app.use(express.static('./public'))
app.use(urlencoded({ extended: false }))

app.post("/", async (req, res) => {
    console.time('scraping')
    const url = 'https://en.wikipedia.org/wiki/List_of_dog_breeds'
    res.end(await crawl(url))
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
