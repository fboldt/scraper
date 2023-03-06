import puppeteer from 'puppeteer';
import robotsParser from 'robots-txt-parser';
import fs from "fs/promises";

const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";
const DEFAULT_HOST = "https://en.wikipedia.org/wiki/List_of_dog_breeds";

async function checkIfAllowed(url) {
   const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT});
   await robots.useRobotsFor(DEFAULT_HOST);
   return robots.canCrawl(url);
}

let galery = [];
export async function crawl(home_link) {
  
  const browser = await puppeteer.launch({waitUntil: 'domcontentloaded'});
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(home_link);


  if (await checkIfAllowed(home_link)) {
    console.log("Fetching images and links from home page...")
    const imgs = await fetchImgs(page);

    galery = galery.concat(imgs);

    const links = await fetchUrls(page);
    
    removeBlankLinks(links)

    for (let link in links) {
      /*gerar instânica de página a partir do link*/
      /*acessar e recuperar imagens.*/
    }

  }

  /*Cheking if the link it's allowed to be crowded.*/
  // console.log("Fetching images: ")
  // var imgs = [];
  // for (var i=0; i<quant; i++) {
  //   if (await checkIfAllowed(urls[i])) {
  //       const somePage = await browser.newPage();
  //       await somePage.setUserAgent(DEFAULT_USER_AGENT);
  //       await somePage.goto(urls[i]);
  //       imgs = await fetchImgs(somePage);
  //     }
  // }
  
  await browser.close();

  await fs.writeFile("public/lista.json", JSON.stringify(galery));
  const link = "<a href='lista.json'>download</a>";
  return link;

}

async function fetchUrls(page) {
  return await page.$$eval('a', as => as.map(a => a.href));
}

async function fetchImgs(link) {
  return await link.$$eval('img', imgs => imgs.map(img => img.src));
}

function removeBlankLinks(list) {
  for (let elem in list) {
    if (list[elem] == "")
      list.splice(elem, elem + 1);
  }
  return list;
}

crawl(DEFAULT_HOST);