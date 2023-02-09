const express = require('express');
const server = express();
const prompt = require('prompt-sync')

server.get('/', (req, res) => {
    dadosRetorno = ['blabla', 3]
    return res.json({link: dadosRetorno[0]})
});

server.listen(3000, ()=>{
    console.log('Servidor está funcionando...')
});

async function dados(){
    var link= prompt('digite o link: ')
    var quant= prompt('digite a quantidade: ')
    retorno = [link, quant]
    return retorno
}

const retorno = dados()
