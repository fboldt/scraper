import jsonData from './dogtime.json' assert { type: "json" }; 
let qtd = 0;
for (let elem of jsonData) {
    for (let imagem of elem.imgSLinks) {
        qtd+=1;
    }
}
console.log(qtd)