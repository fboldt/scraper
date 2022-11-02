const express = require("express");
const pupper = require("puppeteer");


app = express();
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {
    console.time('scraping')
    const url = req.body.url
    const quantidade = req.body.quantidade
    res.end(await geraJson(url, quantidade))
    console.timeEnd('scraping')
});


async function geraJson(url, quantidade) {
    retorno = []
    const browser = await pupper.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);

    //armazenando os links e nomes de cachorros em listas
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
    })

    const nomes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.title)
    })

    //acessa todos os links e seleciona as imagens de cada página
    for (var m = 0; m < quantidade; m++) {
        const json_aux = {}
        await page.goto(links[m]);
        page.waitForNavigation()
        const imagens = await page.evaluate(() => {

            var lista = [];

            let i = 0;
            //Percorre todas as imagens da página e as filtra pelo tamanho
            for (img of document.querySelectorAll("img")) {
                if (document.querySelectorAll("img")[i].height > 70 & document.querySelectorAll("img")[i].width > 70) {
                    lista.push(document.querySelectorAll("img")[i].src);

                }
                i++;
            }
            return lista
        });

        json_aux[nomes[m]] = imagens;
        retorno.push(json_aux)
    }
    
    return JSON.stringify(retorno)
};

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
