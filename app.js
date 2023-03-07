import express, {urlencoded } from "express";
import { geraJson } from "./scraper.js";

const app = express();
app.use(express.static('./public'))
app.use(urlencoded({ extended: false }))

app.post("/", async (req, res) => {
    console.time('scraping')
    const quant = req.body.quantidade
    const url = req.body.url
    res.end(await geraJson(url, quant))
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
