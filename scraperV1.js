
import puppeteer from 'puppeteer'
import fs from "fs/promises"

export async function geraJson(url, quantidade) {
    console.log('scraping')
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage()
    await page.goto(url)
    const retorno = await selecionaImagensPaginas(page, quantidade)
    await delay(4000)
    browser.close()
    await fs.writeFile("public/lista.json", JSON.stringify(retorno))
    const link = "<a href='lista.json'>download</a>"
    return link
};

async function selecionaImagensPaginas(page, quantidade) {
    const retorno = []
    const listaImgs = []
    const imagens = []
    var json_aux = {}
    json_aux["Racas Sem Links"]= await nomeSemLink(page)
    retorno.push(json_aux)

    const links = await listaLinks(page)
    const nomes = await listaNomes(page)
    let cl = 0

    if (quantidade==0){
        quantidade=links.length
    }

    console.log(cl+'/'+quantidade);
    //acessa todos os links e seleciona as imagens de cada página
    for (let m = 0; m < quantidade; m++) {
        const json_aux = {}
        await page.goto(links[m])
        page.waitForNavigation()
        if(await verificaPag(page)){
        const imagens = await getLinksImgs(page)
        console.log(imagens)
        for(let img of imagens){
            page.goto(img)
            await delay(4000)
            listaImgs.push(qualidadeImgs(page))
        }
        json_aux[nomes[m]] = listaImgs;
        retorno.push(json_aux)
        cl+=1
        }
        console.log(cl+'/'+quantidade);

    }
    return JSON.parse(JSON.stringify(retorno))
}

async function listaLinks(page) {
    return page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
    })
}

async function listaNomes(page) {
    return page.evaluate(() => {
        return list = Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.title)
    })
}


async function verificaPag(page) {
    return page.evaluate(() => {
        list = Array.from(document.querySelectorAll("#mw-content-text > div.mw-parser-output > table.infobox.biota")).map(n => n.outerHTML)
        if(list.length != 0){
            return true
        }
        return false
    })
}

async function nomeSemLink(page){
    return page.evaluate(() => {
        const lista = Array.from(document.querySelectorAll(".div-col ul li")).map(n => n.firstChild.data)
        const newList = Array.from(document.querySelectorAll(".div-col ul li > span")).map(n => n.id)
        for (item of lista){
            if (item != null){
                newList.push(item)
            }
        }      
        return newList
    })
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

 async function getLinksImgs(page) {
    return page.evaluate(() => {
        return Array.from(document.querySelectorAll(".image")).map(n => n.href)
    })
}

async function getResolutions(page) {
    return page.evaluate(() => {
        return Array.from(document.querySelectorAll(".mw-thumbnail-link")).map(n => n.href)
    })
}

async function qualidadeImgs(page){
        const links = getResolutions(page)
        let maiorAltura = 0
        let maiorImg = ""
        if(links.lenght>0){
        for(const link of links){
            page.goto(link)
            let altura = page.evaluate((maiorAltura)=>{
                const img = document.querySelector('img')
                if(img.height > maiorAltura){
                    maiorAltura = img.height
                }
                return maiorAltura
            })
            if(altura>maiorAltura){
                maiorImg = link
            }

        }
    }

    return maiorImg
    
 }

