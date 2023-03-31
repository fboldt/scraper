//ideal colocar isso direto no arquivo gerador do json "aglomerado", 
const fs = require("fs");

const list = require("./list.json")
const json = JSON.stringify(list, null, " ") //os parametros do stringify (null, " ") são oq deixam ele separado de forma organizada

fs.writeFile('list_indent.json', json, 'utf-8', (err) => { //só necessário enquanto esse arquivo for externo a geração do primeiro JSON
    if (err) throw err;
    console.log('Arquivo Salvo');
});