
let result = "";
document.getElementById('link-button').addEventListener('click', async () => {
  const url = document.getElementById('link-input').value;
  document.getElementById('link-input').value = "";
  document.getElementById("loading-text").innerHTML = "Em alguns instantes já será possível fazer o download do arquivo."
  
  document.getElementById('download-button').disabled = true;
  
  const response = await fetch('http://localhost:3333/results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  result = await response.json();
  document.getElementById('download-button').disabled = false;
  document.getElementById("loading-text").innerHTML = "Extração concluída!"
});

/**
 * Download a json file with content provide by crawler.
*/
document.getElementById('download-button').addEventListener('click', () => {
  
  document.getElementById('download-button').disabled = true;
  
  const jsonData = JSON.stringify(result, null, " ");
  
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resultado.json';
  a.click();
  
  URL.revokeObjectURL(url);
})

/**
 * Creating table stuff.
*/

const tbody = document.querySelector('tbody');
const createElement = (tag, innerText = "") => {
  const element = document.createElement(tag);
  element.innerText = innerText;
  
  return element;
}

const createRow = (task) => {
  const { link, textoAlternativo, rotulo } = task;
  const tr = createElement('tr');

  const tdLink = createElement('td', link);
  tdLink.classList.add('truncate')

  const tdTextoAlternativo = createElement('td', textoAlternativo);
  tdTextoAlternativo.classList.add('truncate')

  const tdRotulo = createElement('td', rotulo)
  const select = createElement('select')
  const option_zero = createElement('option', 0)
  const option_one = createElement('option', 1)

  tr.appendChild(tdLink);

  tr.appendChild(tdTextoAlternativo);

  tr.appendChild(tdRotulo);
  select.appendChild(option_zero);
  select.appendChild(option_one);
  tdRotulo.appendChild(select);
  tbody.appendChild(tr);
}

document.getElementById("save-results-button").addEventListener('click', () => {
  createRow(task);
});

/**
 * Upload a json file from user computer.
*/
const inputFile = document.querySelector('#input-file')
inputFile.addEventListener('change', function() {
  const arquivo = this.files[0];
  const leitor = new FileReader();

  leitor.addEventListener('load', function() {
    readingFile(eval(leitor.result))
  })

  if (arquivo) {
    leitor.readAsText(arquivo);
  }

  /**
   * Preciso de alguma maneira criar os botões de paginação quando arquivo carregado.
   */
});

const readingFile = (result) => {
  const amountOfImages = 0;
  for (const element of result) {
    for (const image of element.imgSLinks) {
      createRow({link: image.imgUrl, textoAlternativo: image.imgAlt})
      amountOfImages++;
    }
  }
  return amountOfImages;
}

/**
 * Criando a lógica da paginação.
 */
const createPaginationBar = () => {

}