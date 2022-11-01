// V.1 web-scrapping 



//Declarações iniciais
const pupper = require("puppeteer");
const fs = require("fs");
const fsp = require("fs/promises");
//const fssuper = require("@supercharge/filesystem");


const url = "https://en.wikipedia.org/wiki/List_of_dog_breeds";
let cont = 0;

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
   


    function makedir(dir){
        fs.access(dir, fs.constants.F_OK, (err) => { 
            if (err) {
                fs.mkdir(dir, (error) => {
                    if (error){
                        console.log(error);
                    }
                    else {
                        console.log(`Caminho ${dir} Criado`)
                        cont++;
                    }
                });
                return;
            } return;
        });
    }


    //Solicita a função que cria diretórios e Cria pastas Com os nomes das raças de Cachorro
    makedir("Dogs")
    for(const nome of nomes) {
        const dir = `./Dogs/${nome}`;
        makedir(dir)
    }


    let j = 0;
    var cod = 0

    //acessa todos os links e seleciona as imagens de cada página
    for(var m = 0; m < 700; m++){

            await page.goto(links[m]);
            page.waitForNavigation()

            const imagens = await page.evaluate(() => {
                
                var lista = [];
                var listae = [];

                
                let i = 0;

                //Percorre todas as imagens da página e as filtra pelo tamanho

                for(img of document.querySelectorAll("img")){
                    if (document.querySelectorAll("img")[i].height > 70 & document.querySelectorAll("img")[i].width > 70){
                        lista.push(document.querySelectorAll("img")[i].src);
                    }else{

                        //lista das imagens que não são 70px x 70px (Imagens que não são de cachorros)
                        listae.push(document.querySelectorAll("img")[i].src);
                    }
                    i ++;
                }
                return lista
            }); 
        


        //salva cada imagem filtrada em sua respectiva pasta
        for(const imagem of imagens){

            const pagina = await page.goto(imagem)
            await page.setDefaultNavigationTimeout(0); 


            await fsp.writeFile(`./Dogs/${nomes[j]}/${cod}.${imagem.split("/").pop()}`, await pagina.buffer())
            cod ++;
        }
        j ++;

    }

    
    console.log(`${cont} Pastas Criadas!`)
    await browser.close();

})();


//notas pro futuro

//filtrar se ja existe imagem na pasta ou nao

//Começar de uma pasta que não contenha arquivos
