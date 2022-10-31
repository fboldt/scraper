// Retorno Json De links de imagens relacionados as suas respectivas raças

//requires
const pupper = require("puppeteer");
const fs = require("fs");

const retorno = []

const url = "https://en.wikipedia.org/wiki/List_of_dog_breeds";
let cont = 0;

const json_archive = {};

//iniciando puppeteer
(async () =>{

    const browser = await pupper.launch({headless: false});
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
    for(var m = 0; m < 700; m++){
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

            fs.writeFile("retorno.json", JSON.stringify(retorno, null, 1), err => {
                if (err) throw err; 
                //console.log("Done writing"); 
            });
    }


    await browser.close();

})();