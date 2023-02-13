import puppeteer from 'puppeteer';
import tqdm from 'tqdm';
import robotsParser from 'robots-txt-parser';

const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const DEFAULT_HOST = "https://www.atlantbh.com";

async function checkIfAllowed(url) {
   const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT});
   await robots.useRobotsFor(DEFAULT_HOST);
   return robots.canCrawl(url);
}

export async function crawl(linkUsuario) {

  const browser = await puppeteer.launch({waitUntil: 'domcontentloaded'});
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(linkUsuario);
  console.log('Fetching links...');
  const urls = await fetchUrls(page);
  console.log("Done.")

  /*Cheking if the link it's allowed to be crowded.*/
  
  console.log("Fetching images: ")
  for (let url of tqdm(urls)) {
    if (await checkIfAllowed(url)) {
        const somePage = await browser.newPage();
        await somePage.setUserAgent(DEFAULT_USER_AGENT);
        await somePage.goto(url);
      }
}

  await browser.close();

}


async function fetchUrls(page) {
  return await page.$$eval('a', as => as.map(a => a.href));
}

async function fetchImgs(link) {
  return await link.$$eval('img', imgs => imgs.map(img => img.src));
}



// crawl();
