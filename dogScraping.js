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
    await browser.close().catch(e => { console.log(e) });
}
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

// //  Baixa as imagens da lista imagens
// async function baixarImagens(imagens, nome, page){
//     let cod = 0
//     for(const imagem of imagens){
//         const pagina = await page.goto(imagem);
//         await page.setDefaultNavigationTimeout(0); 

//         await fsp.writeFile(`./Dogs/${nome}/${cod}.${imagem.split("/").pop()}`, await pagina.buffer())
//         cod ++;
//     }
// }

// Acessa links que direcionam pro site de cada raça
async function acessarLinks(links, nomes, page){

    let j = 0;
    for(const link of links){

        if (!(fs.readdirSync(`./Dogs/${nomes[j]}`).length)){
            console.log("entrou")
            await page.goto(link).catch(e => { console.log(e) });
            page.waitForNavigation()

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
// -----------------------------------------------------------------------------------------------------------------------
// Chama a função principal
start().catch(e => { console.log(e) });


/* ERRO NA SAIDA APÓS BAIXAR TODOS AS IMAGENS:
(node:12032) UnhandledPromiseRejectionWarning: Error: Navigation failed because browser has disconnected!
    at new LifecycleWatcher (c:\Users\Usuario\node_modules\puppeteer\lib\cjs\puppeteer\common\LifecycleWatcher.js:95:223)
    at Frame.waitForNavigation (c:\Users\Usuario\node_modules\puppeteer\lib\cjs\puppeteer\common\Frame.js:261:25)
    at Page.waitForNavigation (c:\Users\Usuario\node_modules\puppeteer\lib\cjs\puppeteer\common\Page.js:1218:88)
    at acessarLinks (c:\Users\Usuario\Desktop\PROJETOS\scraper\dogScraping.js:86:18)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async start (c:\Users\Usuario\Desktop\PROJETOS\scraper\dogScraping.js:33:5)
(Use `node --trace-warnings ...` to show where the warning was created)
(node:12032) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:12032) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
*/