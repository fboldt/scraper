// ------- IC NERA 2022 - IFES SERRA -----------
//         Web Scrapping com Node JS 
//               Versão: 1.0


// Require das APIs e Módulos utilizados no programa.
const puppeteer = require('puppeteer')
const fs = require('fs')
const fsp = require('fs/promises')

//  Inicio da função.
async function start() {

    // Abre o navegador e uma nova aba.
    const browser = await puppeteer.launch({headless:false})
    const page = await browser.newPage()

    // É redirecionado para a página que queremos.
    await page.goto("https://en.wikipedia.org/wiki/List_of_dog_breeds")

    // Retorna uma lista com o link das páginas das raças dos cachorros.
    const linksDogs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(x => x.href)
    });

    // Retorna uma lista com o nome de todas as raças listadas no site.
    const nomes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".div-col ul li > a")).map(x => x.title)
    });

// Cria pastas para cada uma das raças de cachorros.
    for(const nome of nomes){
        const path = "./"+nome;
        fs.access(path, fs.constants.F_OK, (err) => { // Tenta acessar a pasta para verificar se ela existe.
            if(err){ // Caso de erro executa as linhas a seguir
                fs.mkdir(path, (error) => { // Cria uma pasta com o nome da raça de cachorro.
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("New Directory created successfully !!");   
                    }});
                    return;
                }else{
                    return;
                }}); 
            }

    //Acessa cada página da lista de links e baixa as imagens.
    let i=0;
    for (const link of linksDogs) {
        await page.goto(link)

        //Selecionando todos os links de imagens dentro de cada raça de cachorro.
        const imgsDogs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("img")).map(x => x.src)
        });

        // Abre o endereço de cada imagem e salva na pasta criada com o nome da respectiva raça.
        for (const img of imgsDogs) {
            const imagepage = await page.goto(img)
            await fsp.writeFile('./'+nomes[i]+'/' + img.split("/").pop(), await imagepage.buffer())
        }
        i++;
    }

    // Fecha o navegador.
    await browser.close()
}

// Chama a função criada.
start()
