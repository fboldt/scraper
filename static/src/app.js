const express = require('express') //importacao do pacote
const app = express() //instanciando express

const dogs = {

  "Affenpinscher" : ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Affenpinscher.jpg/220px-Affenpinscher.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borismindre.jpg/170px-Borismindre.jpg"],
  "American Bully" : ["https://upload.wikimedia.org/wikipedia/commons/e/ed/American_bully.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Champion_Charlie_Muscles_%282%29.jpg/220px-Champion_Charlie_Muscles_%282%29.jpg"],
  "Cantabrian Water Dog" : ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Perro_de_Agua_del_Cant%C3%A1brico_Macho_Exposici%C3%B3n.jpg/220px-Perro_de_Agua_del_Cant%C3%A1brico_Macho_Exposici%C3%B3n.jpg"]
  }

app.get('/', function (req, res) { //endereco da requisicao onde e retornado hello world
  res.send(dogs)
})

app.listen(3000) //execucao do servidor