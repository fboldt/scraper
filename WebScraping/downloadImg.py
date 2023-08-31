#
# Versão 2.1
# IFES SERRA 2023
# 
# - Download das imagens geradas pelo Scraper.
#
################################################

import json
import requests

import os
import sys

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

#################################################

def baixarImgs(dados):
    lstError = {}
    totalImgs = 0
    for id, raca in zip(dados.keys(), dados.values()):
        
        lst = []
        dir = './racas/'+ id
        
        if not(os.path.isdir(dir)):
            os.mkdir(dir)
        if (len(os.listdir(dir)) == 0):
            for link in raca:
                nomeArq = dir+"/" + link.split("/").pop()
                r = requests.get(link, stream=True)
                try:
                    with open(nomeArq, 'wb') as f:
                        f.write(r.content)
                except:
                    lst.append(nomeArq)
        else: 
            for link in raca:
                nomeArq = dir+"/" + link.split("/").pop()
                if not(os.path.isfile(nomeArq)):
                    r = requests.get(link, stream=True)
                    try:
                        with open(nomeArq, 'wb') as f:
                            f.write(r.content)
                    except:
                        lst.append(nomeArq)
        
        if (len(lst)!=0):
            lstError[id] = lst             
                    
        print(f"Raca: {id} \nImagens: {raca}\nTotal de Imagens: {len(raca)}\nImgs n baixadas: {lst}\n")
        totalImgs+=len(raca)
    
    print(totalImgs)
    
    return lstError

def main():
    
    nome_arq = 'lista.json'
    
    with open(nome_arq, encoding='utf-8') as meu_json:
        arq = json.load(meu_json)

    if not(os.path.isdir('racas')):
        os.mkdir('./racas')

    racasSemLink = arq["Racas Sem Link"]
    imgsNBaixadas = baixarImgs(arq["Racas com Link"])

    print("Raças sem link: " + str(racasSemLink))
    print(f'Total de racas: {len(arq["Racas Sem Link"]) + len(arq["Racas com Link"])}')
    print(f'Não baixadas: {imgsNBaixadas}')
    meu_json.close()


if __name__ == '__main__':
    main()