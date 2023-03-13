import { readFileSync, writeFileSync } from 'fs';

const data = readFileSync('dados.json');
const json = JSON.parse(data);

for (const photo of photos) {
    const imagepage = await page.goto(photo)
    //photo.split("/") vai nos retornar o último item do endereço? / Segundo parâmetro é conteúdo que queremos salvar.
    await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())
}