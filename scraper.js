
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function geraJson(url, quantidade) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const retorno = await selecionaImagensPaginas(page, quantidade)
    browser.close()
    await fs.writeFile("public/lista.json", JSON.stringify(retorno))
    const link = "<a href='lista.json'>donwload</a>"
    return link
};

async function selecionaImagensPaginas(page, quantidade) {
    retorno = []
    const links = await listaLinks(page)
    const nomes = await listaNomes(page)

    if (quantidade == 0) quantidade = nomes.length

    //acessa todos os links e seleciona as imagens de cada página
    for (let m = 0; m < quantidade; m++) {
        const json_aux = {}
        await page.goto(links[m]);
        page.waitForNavigation()
        const imagens = await avaliaPagina(page)
        tituloPag = await page.evaluate(async () => {
            return document.querySelector('#firstHeading > span').textContent;
        });
        console.log(tituloPag + " pop")
        while(tituloPag !== nomes[m]){
            json_aux[nomes[m]] = [];
            retorno.push(json_aux)
            m++
        }
        json_aux[nomes[m]] = imagens;
        console.log(nomes[m])
        retorno.push(json_aux)
    }
    return JSON.parse(JSON.stringify(retorno))
}

async function listaLinks(page) {
    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
    })
}

async function listaNomes(page) {
    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.title)
    })
}

async function avaliaPagina(page) {
    return page.evaluate(() => {
        const lista = [];
        //Percorre todas as imagens da página e as filtra pelo tamanho
        for (img of document.querySelectorAll("img")) {
            if (img.height > 70 && img.width > 70) {
                lista.push(img.src);
            }
        }
        return lista
    });
}

module.exports = {
    geraJson,
}
