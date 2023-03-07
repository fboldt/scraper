import { readFileSync, writeFileSync } from 'fs';

// Lendo um arquivo JSON
const data = readFileSync('dados.json');
const json = JSON.parse(data);

// Manipulando os dados do arquivo
json.novoCampo = 'novo valor';
json.novaLista = [1, 2, 3];

// Gravando o arquivo JSON modificado
writeFileSync('dados-modificados.json', JSON.stringify(json));