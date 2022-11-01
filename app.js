const express = require("express");
const pupper = require("puppeteer");
const fs = require("fs");

app = express();
const bodyParser = require("body-parser");

var urlencondedParser = bodyParser.urlencoded({extended: false});

app.get("/", (req, res) =>{
    res.sendfile(__dirname + "/index.html"); 
});

app.post("/", urlencondedParser, (req, res) =>{
    res.end(typeof req.query.url)
    //res.end(geraJson(req.query.url))
});


async function geraJson (url){
    retorno = []
    const browser = await pupper.launch();
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
    for(var m = 0; m < 5; m++){
        const json_aux = {}
            await page.goto(links[m]);
            page.waitForNavigation()
            const imagens = await page.evaluate(() => {
                
                var lista = [];

                let i = 0;
                //Percorre todas as imagens da página e as filtra pelo tamanho
                for(img of document.querySelectorAll("img")){
                    if (document.querySelectorAll("img")[i].height > 70 & document.querySelectorAll("img")[i].width > 70){
                        lista.push(document.querySelectorAll("img")[i].src);

                    }
                    i ++;
                }
                return lista
            }); 

            json_aux[nomes[m]] = imagens;
            retorno.push(json_aux)
    }
    
    await browser.close();
    return retorno
};


app.listen(8081);
