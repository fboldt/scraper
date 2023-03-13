import puppeteer from 'puppeteer';
import robotsParser from 'robots-txt-parser';
// import fs from "fs/promises";
// const fs = require('fs');
import { readFileSync, writeFileSync } from 'fs';

const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";
const DEFAULT_HOST = "https://en.wikipedia.org/wiki/List_of_dog_breeds";
const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT });
const link_list = 'lista.json';

/*lendo o arquivo json que contém os links*/
const data = readFileSync('public/lista.json');
const json = JSON.parse(data);

async function checkIfAllowed(url) {
  await robots.useRobotsFor(url);
  return robots.canCrawl(url);
}

//Foi removido o limitador de links por enquanto.
async function crawl(home_link = DEFAULT_HOST) {

  const browser = await puppeteer.launch({ waitUntil: 'domcontentloaded' });
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(home_link);
  let galery = [];

  if (await checkIfAllowed(home_link)) {

    console.log("Fetching images and links...");
    galery = galery.concat(await fetchImgs(page));
    const links = await fetchUrls(page);

    let link;
    for (let i = 0; i < links.length; i++) {
      link = links[i];
      
      if (await checkIfAllowed(link)) {
        await page.goto(link, {timeout: 0});
        galery = galery.concat(await fetchImgs(page));
        console.log(i + "/" + links.length);
      }
    }

    //Atribui "galery" ao atributo "links" do arquivo lista.json
    json.links = galery;
  }

  await browser.close();
  // await fs.writeFile(`public/${link_list}`, galery.toString());
  writeFileSync(`public/${link_list}`, JSON.stringify(json));
  return link_list;
}

async function fetchUrls(page) {
  return await page.$$eval('a', as => as.map(a => a.href));
}

async function fetchImgs(link) {
  return await link.$$eval('img', imgs => imgs.map(img => img.src));
}

export { crawl }
