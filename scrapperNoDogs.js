import puppeteer from 'puppeteer'
import fs from "fs/promises"

const dogsUrl = 'https://en.wikipedia.org/wiki/List_of_dog_breeds'
const mainUrl = 'https://en.wikipedia.org/wiki/Special:Random'

const quantity = 5;

const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()
const dogsList = await createDogsList(page, dogsUrl)
console.log(dogsList)
const randomList = await createRamdomList(page, mainUrl, dogsList, quantity)

await fs.writeFile("randomUrls.json", JSON.stringify(randomList))

browser.close()


async function createDogsList(page, dogsUrl) {
    await page.goto(dogsUrl)
    console.log('Scraping Dogs List...')
    return page.evaluate(() => {
        return list = Array.from(document.querySelectorAll(".div-col ul li > a")).map(n => n.href)
    })
}

async function createRamdomList(page, mainUrl, dogsList, quantity) {
    console.log('Scraping ramdom List...')
    const randomList = {}
    
    do{
        await page.goto(mainUrl)
        const linkRandom = await getLinkPage(page)
        if(await verifyPage(dogsList, linkRandom) === false){
            continue
        }
        randomList[linkRandom]= await getText(page)
        console.log(Object.keys(randomList).length)

    }
    while((Object.keys(randomList).length)<quantity)
    console.log(randomList)
    return randomList
}

async function getLinkPage(page){
    return page.evaluate(() => {
        return (document.querySelector('.mw-jump-link').href).replace('#bodyContent', '')
    })
}

async function verifyPage(dogsList, linkRandom){
    for(const link of dogsList){
        if(linkRandom === link){
            return false
        }
    }
    return true
}

async function getText(page){
    return page.evaluate(() => {
        let firstp = ""
        if(document.querySelector('.mw-empty-elt') !== null){
            firstp = document.querySelectorAll('p')[1]
        }
        else{
            firstp = document.querySelectorAll('p')[0]
        }

        return firstp.textContent
    })
}