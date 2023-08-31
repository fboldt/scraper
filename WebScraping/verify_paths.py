#
# Versão 1.1
# IFES SERRA 2023
# 
# - Remove pastas vazias
#
################################################

import os
import sys
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

#################################################

def main():
    nomePasta = "racas"
    listaPastas = os.listdir(nomePasta)
    pastasComArquivos = []
    pastasSemArquivos = []
    
    
    for nome in listaPastas:
        if len(os.listdir(nomePasta+"/"+nome))==0:
            pastasSemArquivos.append(nome)
            os.rmdir(nomePasta+"/"+nome)
        else:
            pastasComArquivos.append(nome)
            
    print("Pastas excluidas - sem arquivos:" + str(pastasSemArquivos))
    print("Pastas com arquivos:" + str(pastasComArquivos))
    
main()