from flask import Flask, jsonify

import json
import requests

import os

########################################

def baixarImgs(dados):
    for item in dados:
        for raca, links in item.items():
            
            dir = './racas/'+ raca
            
            if not(os.path.isdir(dir)):
                os.mkdir(dir)
            if (len(os.listdir(dir)) == 0):
                for link in links:
                    nomeArq = dir+"/" + link.split("/").pop()
                    r = requests.get(link, stream=True)
                    with open(nomeArq, 'wb') as f:
                        f.write(r.content)
                    
            else: 
                for link in links:
                    nomeArq = dir+"/" + link.split("/").pop()
                    if not(os.path.isfile(nomeArq)):
                        r = requests.get(link, stream=True)
                        with open(nomeArq, 'wb') as f:
                            f.write(r.content)
                        
                        
            print(f"Raca: {raca}\nImagens: {links}\nTotal de Imagens: {len(links)}\n")


def main():

  with open('public/lista.json', encoding='utf-8') as meu_json:
    dados = json.load(meu_json)
    
  if not(os.path.isdir('racas')):
    os.mkdir('./racas')

  print(dados)
  baixarImgs(dados)
    
  print(f'Total de racas: {len(dados)}')
  meu_json.close()


if __name__ == '__main__':
    main()