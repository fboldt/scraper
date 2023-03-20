
import puppeteer from 'puppeteer';
import fs from "fs/promises";

export async function geraJson(url, quantidade) {
    console.log('scraping');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    const retorno = await selecionaImagensPaginas(page, quantidade)
    await delay(4000);
    browser.close();
    await fs.writeFile("public/lista.json", JSON.stringify(retorno));
    const link = "<a href='lista.json'>download</a>";
    return link;
};

async function selecionaImagensPaginas(page, quantidade) {
    const retorno = []
    // json_aux["Racas Sem Links"]= await nomeSemLink(page)
    // retorno.push(json_aux)
    
    const links = await listaLinks(page)
    var nomes = []
    let cl= 0; // cl = contlista
    if (quantidade==0){quantidade=links.length;}
    //acessa todos os links e seleciona as imagens de cada página
    for (let m = 0; m < quantidade; m++) {
        const json_aux = {}
        await page.goto(links[m]);

        if(await verificaPag(page)){
            console.log("Pag no padrao")
            let nome= await listaNomes(page)
            nomes.push(nome)
            page.waitForNavigation()
            const imagens = await avaliaPagina(page)
            console.log(nomes[cl])
            json_aux[nomes[cl]] = imagens;
            retorno.push(json_aux)
            cl+=1;
        }
        else{
            console.log("Pag fora do padrao")
        }

    }
    return JSON.parse(JSON.stringify(retorno))
}

// async function listaLinks(page) {
//     return page.evaluate(() => {
//         return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
//     })
// }


async function listaLinks(page) {
    // return page.evaluate(() => {
    //     const links = Array.from(document.querySelectorAll("main a")).map(n => n.href);
    //     return links.filter(link => !link.closest('header') && link.matches('a[href]')).map(link => link.href);
    // })
    return await page.$$eval('main a', (links) => {
        return links.filter(link => !link.closest('header') && link.matches('a[href]'))
          .map(link => link.href);
      });
}

// async function listaNomes(page) {
//     return page.evaluate(() => {
//         return list = Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.title)
//     })
// }


async function listaNomes(page) {
    
    const title = page.evaluate(() => {
        return document.querySelector("h1").textContent; 
    });

    if((title.toString()).includes("span")){
        title = page.evaluate(() => {
            return document.querySelector("h1 > span").textContent; 
        });
    }

    return title;
}


async function verificaPag(page) {
    return page.evaluate(() => {
        try{
        list = Array.from(document.querySelectorAll("#mw-content-text > div.mw-parser-output > table.infobox.biota")).map(n => n.outerHTML)
        if(list.length != 0){
            return true
        }
        return false
        }
    catch(e){
        return false
    }
    });   

}


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
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

