import puppeteer from 'puppeteer';
import robotsParser from 'robots-txt-parser';

import { writeFileSync } from 'fs'; // import { readFileSync, writeFileSync } from 'fs';

const DEFAULT_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";
const DEFAULT_HOST = "https://en.wikipedia.org/wiki/List_of_dog_breeds";
const robots = robotsParser({ userAgent: DEFAULT_USER_AGENT });

var objectsList = [];

async function checkIfAllowed(url) {
  await robots.useRobotsFor(url);
  return robots.canCrawl(url);
}

async function crawl(home_link = DEFAULT_HOST, quant) {

  const browser = await puppeteer.launch({ waitUntil: 'domcontentloaded' });
  const page = await browser.newPage();
  await page.setUserAgent(DEFAULT_USER_AGENT);
  await page.goto(home_link);

  if (await checkIfAllowed(home_link)) {
    
    console.log("Fetching images and links...");
    const imgs = await fetchImgs(page);
    const links = await fetchUrls(page);

    objectsList.push({url: DEFAULT_HOST, imgSLinks: imgs});

    let link;
    for (let i = 0; i < links.length && i++ <quant; i++) {
      link = links[i].url;
      try {
        if (await checkIfAllowed(link)) {
          await page.goto(link, {timeout: 0}); //precisamos do timeout?
          objectsList.push({url: link, textContent: links[i].textContent, imgSLinks: await fetchImgs(page)});
          console.log(i + "/" + links.length);
        }
      } catch(error) {
        console.log('Ocorreu um erro:', error)
        console.log('O link que está gerando o erro:', link)
      }
    }
  }
  
  await browser.close();

  writeFileSync(`public/${'list.json'}`, JSON.stringify(objectsList, null, " "));
  return 'list.json';
}

async function fetchUrls(page) {
  return await page.$$eval('a', as => as.map(a => {
    return {
      url: a.href,
      textContent: a.textContent,
      }
    }));
}

async function fetchImgs(link) {
  return await link.$$eval('img', imgs => imgs.map(img => {
    return {
      imgUrl: img.src,
      imgAlt: img.alt
    }
  }))
}

export { crawl }