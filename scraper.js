
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function geraJson(url, quantidade) {
    retorno = []
    const browser = await puppeteer.launch();
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
    await fs.writeFile("public/lista.json", JSON.stringify(retorno))
    browser.close()
    const link = "<a href='lista.json'>donwload</a>"
    return link
};

module.exports = {
    geraJson,
}
