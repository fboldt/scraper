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

    console.log("Fetching images and links from home page...");
    const imgs = await fetchImgs(page);

    galery = galery.concat(imgs);

    const links = await fetchUrls(page);
    console.log("Done.");

    for (let link in links) {
      const browser = await puppeteer.launch({waitUntil: 'domcontentloaded'});
      if (await checkIfAllowed(link)) {
        const page = await browser.newPage();
        await page.setUserAgent(DEFAULT_USER_AGENT);
        await page.goto(link);
        galery = galery.concat(await fetchImgs(page));
      }
    }

  }
  
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

function removeEmptyLinks(list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] == "")
      list.splice(i, i+1);
  }
  return list
}

crawl(DEFAULT_HOST);