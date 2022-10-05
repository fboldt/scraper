// ------- IC NERA 2022 - IFES SERRA -----------
//         Web Scrapping com Node JS 
//               Versão: 3.0


//Declarações iniciais
const pupper = require("puppeteer");
const fs = require("fs");
const fsp = require("fs/promises");

const url = "https://en.wikipedia.org/wiki/List_of_dog_breeds";
let cont = 0;

// -------------------------------------------------------------------------------------------------------
//Programa principal
async function start(){

    const browser = await pupper.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url).catch(e => { console.log(e) });
    
    //armazenando os links e nomes de cachorros em listas
    const links = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
    })

    const nomes = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.title)
    })

    criarPastas(nomes);
    await acessarLinks(links, nomes, page).catch(e => { console.log(e) });
    await browser.close();
}

// -----------------------------------------------------------------------------------------------------------------------
// Chama a função principal
start().catch(e => { console.log(e) });

// ------------------------------------------------------------------------------------------------------
// Funções utilizadas

// Cria diretório
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
        } return;
    });
}

//  Cria pastas com subpastas com o nome de todos os cachorros
function criarPastas(nomes){
    makedir("Dogs")
    for(const nome of nomes) {
        const dir = `./Dogs/${nome}`;
        makedir(dir)
    }
}


// Acessa links que direcionam pro site de cada raça
async function acessarLinks(links, nomes, page){

    let j = 0;
    for(const link of links){

        if (!(fs.readdirSync(`./Dogs/${nomes[j]}`).length)){
            console.log("entrou")
            await page.goto(link).catch(e => { console.log(e) });

            const imagens = await page.evaluate(() => {
                const lista = [];
                let i = 0;
                for(img of document.querySelectorAll("img")){
                    if (document.querySelectorAll("img")[i].height > 100 & document.querySelectorAll("img")[i].width > 100){
                        lista.push(document.querySelectorAll("img")[i].src);
                    }
                    i ++;
                }
                return lista
            });

            let cod = 0
            for(const imagem of imagens){
                const pagina = await page.goto(imagem);
                await page.setDefaultNavigationTimeout(0); 
        
                await fsp.writeFile(`./Dogs/${nomes[j]}/${cod}.${imagem.split("/").pop()}`, await pagina.buffer())
                cod ++;
        }
    }
            
    
        j ++;
    }
}

