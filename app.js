import express, { urlencoded } from "express";
import { crawl } from "./crawler.js";

const app = express();
app.use(express.static('./public'))
app.use(urlencoded({ extended: false }))

app.post("/", async (req, res) => {
    console.time('crawl')
    const quant = req.body.quantidade
    const url = req.body.url
    const link_list = await crawl(url, quant)
    res.end(`<a href="${link_list}">Lista de objetos (estruturada um pouco melhor).</a>`)
    console.timeEnd('crawl')
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
