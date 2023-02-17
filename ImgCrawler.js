import puppeteer from 'puppeteer';
// import tqdm from 'tqdm';
import robotsParser from 'robots-txt-parser';
import fs from "fs/promises";


const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const DEFAULT_HOST = "https://www.atlantbh.com";

async function checkIfAllowed(url) {
   const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT});
   await robots.useRobotsFor(DEFAULT_HOST);
   return robots.canCrawl(url);
}

//Não está funcioando.
export async function crawl_parallelized(linkUsuario, quant) {

  const browser = await puppeteer.launch({waitUntil: 'domcontentloaded'});
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(linkUsuario);
  console.log('Fetching links...');
  const urls_ = await fetchUrls(page);
  console.log("Done.")

  const urls = [];
  for (let i = 0; i <= quant; i++) {
    urls.push(urls_[i]);
  }

  const browserPromises = [];
  let totalPagesPerBrowserCount = 1;
  let totalBrowserInstancesCount = 4;
  
  while (--totalBrowserInstancesCount >= 0) {
    browserPromises.push(
      //
      new Promise (async (browserResponse) => {
        const browser = await puppeteer.launch();
        const pagePromises = [];
        totalPagesPerBrowserCount = 1;
        while (--totalPagesPerBrowserCount >= 0) {
          pagePromises.push(
            //
            new Promise(async (pageResponse) => {
              do {
                const url = urls.pop();
                if (await checkIfAllowed(url)) {
                  let page = await browser.newPage();
                  await page.goto(url);
                  fetchImgs(url)
                  await page.close();
                }
              } while (urls.lenght > 0);
              pageResponse();
            })
          );
        }
        await Promise.all(pagePromises);
        await browser.close();
        browserResponse();
      })
    );
  }
  await Promise.all(browserPromises);
}

export async function crawl(linkUsuario, quant) {

  const browser = await puppeteer.launch({waitUntil: 'domcontentloaded'});
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(linkUsuario);
  console.log('Fetching links...');
  const urls = await fetchUrls(page);
  console.log("Done.")

  /*Cheking if the link it's allowed to be crowded.*/
console.log("Fetching images: ")
var imgs = [];
  for (var i=0; i<quant; i++) {
    if (await checkIfAllowed(urls[i])) {
        const somePage = await browser.newPage();
        await somePage.setUserAgent(DEFAULT_USER_AGENT);
        await somePage.goto(urls[i]);
        imgs = await fetchImgs(somePage);
      }
}
  
  await browser.close();

  await fs.writeFile("public/lista.json", JSON.stringify(imgs));
  const link = "<a href='lista.json'>download</a>";
  return link;

}

async function fetchUrls(page) {
  return await page.$$eval('a', as => as.map(a => a.href));
}

async function fetchImgs(link) {
  return await link.$$eval('img', imgs => imgs.map(img => img.src));
}

// crawl();