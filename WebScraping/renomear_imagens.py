import os
import re

def substituir_caracteres_invalidos(nome):
    # Substitui caracteres inválidos por sublinhado
    return re.sub(r'[<>:"/\\|?*]', '_', nome)

def limitar_comprimento(nome, comprimento_max):
    # Limita o comprimento do nome
    return nome[:comprimento_max]

def obter_novo_nome(raca_folder, count, imagem_file, comprimento_max):
    # Remove caracteres especiais e converte para minúsculas
    nome_sem_caracteres_invalidos = substituir_caracteres_invalidos(re.sub(r'[^\w\s.]', '', raca_folder.lower()))
    nome_limitado = limitar_comprimento(nome_sem_caracteres_invalidos, comprimento_max - len(str(count)) - len(os.path.splitext(imagem_file)[1]) - 1)
    novo_nome = f"{nome_limitado}_{count}{os.path.splitext(imagem_file)[1]}"
    novo_nome = novo_nome.replace(' ', '_')  # Adiciona underscores entre as palavras
    return novo_nome

def renomearImagens(caminho_pasta, comprimento_max=255):
    for raca_folder in os.listdir(caminho_pasta):
        raca_path = os.path.join(caminho_pasta, raca_folder)

        if os.path.isdir(raca_path):
            count = 1
            for imagem_file in os.listdir(raca_path):
                imagem_path_antigo = os.path.join(raca_path, imagem_file)

                while True:
                    novo_nome = obter_novo_nome(raca_folder, count, imagem_file, comprimento_max)
                    imagem_path_novo = os.path.join(raca_path, novo_nome)

                    if not os.path.exists(imagem_path_novo):
                        break  # Sai do loop se o novo nome for único
                    count += 1

                # Renomeia o arquivo
                os.rename(imagem_path_antigo, imagem_path_novo)

if __name__ == "__main__":
    pasta_base = "./new_racas"  # Substitua pelo caminho da sua pasta "new_racas"
    renomearImagens(pasta_base)
