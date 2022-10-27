from flask import Flask, jsonify

import requests

import os

########################################


def pegarDados():

  link = "http://127.0.0.1:5000/"

  requisicao = requests.get(link)

  dicionario = requisicao.json()
  for raca, links in dicionario.items():
    print(f"{raca},{links}\n")
    dir = './'+raca
    os.mkdir(dir)
    for link in links:
        r = requests.get(link, stream=True)
        with open(dir+"/"+link.split("/").pop(), 'wb') as f:
            f.write(r.content)
  



if __name__ == '__main__':
  pegarDados()