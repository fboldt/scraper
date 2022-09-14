// EXEMPLO REALIZADO UTILIZANDO O SITE MERCADO LIVRE E LISTANDO PRODUTOS

const pup=require('puppeteer');
const fs=require('fs');

const url="https://www.mercadolivre.com.br";
const searchFor="macbook";
let c=1;
const list=[];

(async () => {
    const browser = await pup.launch({headless:false});
    const page = await browser.newPage();
    console.log("iniciei!");
    await page.goto(url);
    await page.waitForSelector('#cb1-edit');
    await page.type('#cb1-edit', searchFor);

    await Promise.all([
        page.waitForNavigation(),
        page.click('.nav-search-btn')
    ])

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href));

    for (const link of links){
        if (c===10) continue;
        console.log('pagina', c);
        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title');
        
        const title = await page.$eval('.ui-pdp-title', element => element.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

        const obj={};
        obj.title=title;
        obj.price=price;
        list.push(obj);
        c++;
    }

    await page.waitForTimeout(3000);
    console.log(list);
    fs.writeFile('listaProdutos.json', JSON.stringify(list, null, 2), err =>{
        if(err) throw new Error("Erro!")
        console.log("Arquivo salvo!")
      })

    await browser.close();
    console.log("fui para a url!");

})();